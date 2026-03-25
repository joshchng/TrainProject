import type { ETDResponse } from '@/api/types';
import { LINES } from './map-data';

export interface TrainAtStation {
  id: string;
  stationAbbr: string;
  color: string;
  hexcolor: string;
  destination: string;
  destAbbr: string;
  minutes: number;
  direction: 'North' | 'South';
}

interface Sighting {
  stationAbbr: string;
  destAbbr: string;
  destination: string;
  minutes: number;
  color: string;
  hexcolor: string;
  direction: 'North' | 'South';
}

/**
 * Minimum rank-0 drop (in minutes) between reporting stations required to
 * recognise a new physical train. Set above typical inter-station travel
 * time (~3 min) so measurement noise doesn't create phantom trains.
 */
const WAVE_THRESHOLD = 4;

/**
 * Converts raw ETD data into a deduplicated list of physical trains, each
 * pinned to its nearest reporting station.
 *
 * Uses a route-sweep wavefront algorithm: for every (color, destination)
 * group the stations are walked in route order and physical trains are
 * identified from the ascending / descending pattern of the nearest-train
 * minutes (rank-0) across stations.  Each "valley" in the rank-0 sequence
 * corresponds to one physical train.
 *
 * This overcomes the BART API's 3-estimates-per-station cap (the old
 * max-per-station approach was hard-capped at 3 trains per group) and
 * produces stable per-station assignments that don't jump on refresh.
 */
export function getStationTrains(allETDs: ETDResponse[]): TrainAtStation[] {
  const sightings: Sighting[] = [];

  for (const stationETD of allETDs) {
    for (const dest of stationETD.destinations) {
      for (const est of dest.estimates) {
        if (est.cancelflag) continue;
        sightings.push({
          stationAbbr: stationETD.stationAbbr,
          destAbbr: dest.abbreviation,
          destination: dest.destination,
          minutes: est.minutes === 'Leaving' ? 0 : est.minutes,
          color: est.color,
          hexcolor: est.hexcolor,
          direction: est.direction,
        });
      }
    }
  }

  const groups = new Map<string, Sighting[]>();
  for (const s of sightings) {
    const key = `${s.color.toUpperCase()}::${s.destAbbr}`;
    let group = groups.get(key);
    if (!group) {
      group = [];
      groups.set(key, group);
    }
    group.push(s);
  }

  const trains: TrainAtStation[] = [];

  for (const [key, group] of groups) {
    const sep = key.indexOf('::');
    const colorUpper = key.slice(0, sep);
    const destAbbr = key.slice(sep + 2);

    const line = LINES.find((l) => l.color === colorUpper);
    const destIdx = line ? line.stations.indexOf(destAbbr) : -1;

    const byStation = new Map<string, Sighting[]>();
    for (const s of group) {
      const arr = byStation.get(s.stationAbbr) ?? [];
      arr.push(s);
      byStation.set(s.stationAbbr, arr);
    }
    for (const arr of byStation.values()) {
      arr.sort((a, b) => a.minutes - b.minutes);
    }

    if (!line || destIdx === -1) {
      addFallbackTrains(byStation, colorUpper, destAbbr, trains);
      continue;
    }

    // Walk from the far end of the line (origin) toward the destination
    // so we encounter trains in the order they entered the route.
    const walkForward = destIdx >= line.stations.length / 2;
    const orderedStations = walkForward
      ? line.stations.filter((s) => byStation.has(s))
      : [...line.stations].reverse().filter((s) => byStation.has(s));

    if (orderedStations.length === 0) continue;

    const detected = detectWavefronts(orderedStations, byStation);

    // Number from the destination end so React keys stay stable when new
    // trains enter at the origin end of the line.
    for (let i = 0; i < detected.length; i++) {
      const s = detected[i];
      const fromDest = detected.length - 1 - i;
      trains.push({
        id: `${colorUpper}-${destAbbr}-${fromDest}`,
        stationAbbr: s.stationAbbr,
        color: s.color,
        hexcolor: s.hexcolor,
        destination: s.destination,
        destAbbr: s.destAbbr,
        minutes: s.minutes,
        direction: s.direction,
      });
    }
  }

  return trains;
}

/**
 * Walks stations in route order and detects physical trains from the
 * rank-0 (nearest-train) minute pattern.  The state machine alternates
 * between two phases:
 *
 *   FOUND  – we are near a train; track the minimum minutes seen so far.
 *            Transition to SEEKING when minutes rise by more than WAVE_THRESHOLD.
 *   SEEKING – we are between trains; track the running maximum.
 *            Transition to FOUND when minutes drop by more than WAVE_THRESHOLD.
 *
 * Each FOUND→SEEKING transition emits one physical train at the station
 * where the minimum was observed.
 */
function detectWavefronts(
  orderedStations: string[],
  byStation: Map<string, Sighting[]>,
): Sighting[] {
  const detected: Sighting[] = [];

  if (orderedStations.length === 0) return detected;

  const first = byStation.get(orderedStations[0])![0];
  if (orderedStations.length === 1) {
    detected.push(first);
    return detected;
  }

  let state: 'found' | 'seeking' = 'found';
  let currentMin = first.minutes;
  let currentBest: Sighting = first;
  let runningMax = currentMin;

  for (let i = 1; i < orderedStations.length; i++) {
    const rank0 = byStation.get(orderedStations[i])![0];
    const mins = rank0.minutes;

    if (state === 'found') {
      if (mins < currentMin) {
        currentMin = mins;
        currentBest = rank0;
      } else if (mins > currentMin + WAVE_THRESHOLD) {
        detected.push(currentBest);
        state = 'seeking';
        runningMax = mins;
      }
    } else {
      if (mins > runningMax) {
        runningMax = mins;
      }
      if (mins < runningMax - WAVE_THRESHOLD) {
        state = 'found';
        currentMin = mins;
        currentBest = rank0;
      }
    }
  }

  if (state === 'found') {
    detected.push(currentBest);
  }

  return detected;
}

/**
 * Fallback for groups whose destination isn't represented in the LINES
 * topology (e.g. variant short-turns like YELLOW→MLBR).  Uses the
 * original max-per-station heuristic since we have no route ordering.
 */
function addFallbackTrains(
  byStation: Map<string, Sighting[]>,
  colorUpper: string,
  destAbbr: string,
  trains: TrainAtStation[],
): void {
  let trainCount = 0;
  for (const arr of byStation.values()) {
    trainCount = Math.max(trainCount, arr.length);
  }

  for (let rank = 0; rank < trainCount; rank++) {
    let best: Sighting | null = null;
    for (const arr of byStation.values()) {
      if (rank < arr.length) {
        if (!best || arr[rank].minutes < best.minutes) {
          best = arr[rank];
        }
      }
    }
    if (best) {
      trains.push({
        id: `${colorUpper}-${destAbbr}-fb${rank}`,
        stationAbbr: best.stationAbbr,
        color: best.color,
        hexcolor: best.hexcolor,
        destination: best.destination,
        destAbbr: best.destAbbr,
        minutes: best.minutes,
        direction: best.direction,
      });
    }
  }
}
