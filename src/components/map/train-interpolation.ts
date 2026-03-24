import type { ETDResponse } from '@/api/types';
import { LINES, STATION_MAP, LINE_PATH_NUDGE, type MapLine } from './map-data';

export interface EstimatedTrain {
  id: string;
  x: number;
  y: number;
  color: string;
  hexcolor: string;
  destination: string;
  destAbbr: string;
  sourceStation: string;
}

const AVG_TRAVEL_TIME = 4.5;
const DEDUP_GAP = 5;

interface Sighting {
  stationAbbr: string;
  destAbbr: string;
  destination: string;
  minutes: number;
  color: string;
  hexcolor: string;
  direction: 'North' | 'South';
}

function findLineForTrain(color: string, stationAbbr: string): MapLine | undefined {
  const upper = color.toUpperCase();
  return LINES.find((l) => l.color === upper && l.stations.includes(stationAbbr));
}

function computePosition(
  sighting: Sighting,
  line: MapLine,
): { x: number; y: number } | null {
  const stIdx = line.stations.indexOf(sighting.stationAbbr);
  if (stIdx === -1) return null;

  const destIdx = line.stations.indexOf(sighting.destAbbr);
  if (destIdx === -1) return null;

  const movingForward = destIdx > stIdx;
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

  const t = Math.min(sighting.minutes / AVG_TRAVEL_TIME, 1);
  const fraction = 1 - t * t;

  return {
    x: prevStation.x + (currentStation.x - prevStation.x) * fraction,
    y: prevStation.y + (currentStation.y - prevStation.y) * fraction,
  };
}

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

  const trains: EstimatedTrain[] = [];

  for (const [, group] of groups) {
    group.sort((a, b) => a.minutes - b.minutes);

    let lastPlacedMin = -Infinity;
    let trainIdx = 0;

    for (const sighting of group) {
      if (sighting.minutes - lastPlacedMin < DEDUP_GAP) continue;

      const line = findLineForTrain(sighting.color, sighting.stationAbbr);
      if (!line) continue;

      const pos = computePosition(sighting, line);
      if (!pos) continue;

      const [nx, ny] = LINE_PATH_NUDGE[line.color] ?? [0, 0];
      trains.push({
        id: `${sighting.color.toUpperCase()}-${sighting.destAbbr}-${trainIdx}`,
        x: pos.x + nx,
        y: pos.y + ny,
        color: sighting.color,
        hexcolor: sighting.hexcolor,
        destination: sighting.destination,
        destAbbr: sighting.destAbbr,
        sourceStation: sighting.stationAbbr,
      });

      lastPlacedMin = sighting.minutes;
      trainIdx++;
    }
  }

  return trains;
}
