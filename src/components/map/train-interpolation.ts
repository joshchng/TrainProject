import type { ETDResponse } from '@/api/types';
import { LINES, STATION_MAP, LINE_PATH_NUDGE, type MapLine } from './map-data';

export interface EstimatedTrain {
  x: number;
  y: number;
  color: string;
  hexcolor: string;
  destination: string;
  destAbbr: string;
}

const AVG_TRAVEL_TIME = 3;
const DEDUP_GAP = 5;

interface Sighting {
  stationAbbr: string;
  destAbbr: string;
  destination: string;
  minutes: number;
  color: string;
  hexcolor: string;
}

function findLineForTrain(color: string, stationAbbr: string): MapLine | undefined {
  const upper = color.toUpperCase();
  return LINES.find((l) => l.color === upper && l.stations.includes(stationAbbr));
}

/**
 * Given a train sighting, compute its estimated (x, y) position on the map
 * by interpolating between the station it's approaching and the previous
 * station on the line (the direction it's coming from).
 */
function computePosition(
  sighting: Sighting,
  line: MapLine,
): { x: number; y: number } | null {
  const stIdx = line.stations.indexOf(sighting.stationAbbr);
  if (stIdx === -1) return null;

  const destIdx = line.stations.indexOf(sighting.destAbbr);
  const movingForward = destIdx >= stIdx;

  const prevIdx = movingForward ? stIdx - 1 : stIdx + 1;

  const currentStation = STATION_MAP.get(line.stations[stIdx]);
  if (!currentStation) return null;

  if (prevIdx < 0 || prevIdx >= line.stations.length) {
    return { x: currentStation.x, y: currentStation.y };
  }

  const prevStation = STATION_MAP.get(line.stations[prevIdx]);
  if (!prevStation) {
    return { x: currentStation.x, y: currentStation.y };
  }

  // fraction=1 means at the station, fraction=0 means at the previous station
  const fraction = 1 - Math.min(sighting.minutes / AVG_TRAVEL_TIME, 1);

  return {
    x: prevStation.x + (currentStation.x - prevStation.x) * fraction,
    y: prevStation.y + (currentStation.y - prevStation.y) * fraction,
  };
}

/**
 * From a full set of ETD responses (one per station), estimate individual
 * train positions on the map by interpolation, then deduplicate so the
 * same physical train isn't rendered multiple times.
 */
export function interpolateTrains(allETDs: ETDResponse[]): EstimatedTrain[] {
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
        });
      }
    }
  }

  // Group by (color + destination) — each group contains reports of the same
  // set of trains observed from different stations along the line.
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

  const trains: EstimatedTrain[] = [];

  for (const [, group] of groups) {
    group.sort((a, b) => a.minutes - b.minutes);

    // Walk through sorted sightings; pick the lowest-minutes sighting for
    // each unique physical train (skip subsequent sightings within DEDUP_GAP).
    let lastPlacedMin = -Infinity;

    for (const sighting of group) {
      if (sighting.minutes - lastPlacedMin < DEDUP_GAP) continue;

      const line = findLineForTrain(sighting.color, sighting.stationAbbr);
      if (!line) continue;

      const pos = computePosition(sighting, line);
      if (!pos) continue;

      const [nx, ny] = LINE_PATH_NUDGE[line.color] ?? [0, 0];
      trains.push({
        x: pos.x + nx,
        y: pos.y + ny,
        color: sighting.color,
        hexcolor: sighting.hexcolor,
        destination: sighting.destination,
        destAbbr: sighting.destAbbr,
      });

      lastPlacedMin = sighting.minutes;
    }
  }

  return trains;
}
