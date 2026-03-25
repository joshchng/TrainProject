import type { ETDResponse } from '@/api/types';

export interface TrainAtStation {
  id: string;
  stationAbbr: string;
  color: string;
  hexcolor: string;
  destination: string;
  destAbbr: string;
  minutes: number;
}

const DEDUP_GAP = 5;

interface Sighting {
  stationAbbr: string;
  destAbbr: string;
  destination: string;
  minutes: number;
  color: string;
  hexcolor: string;
}

/**
 * Converts raw ETD data into a flat list of trains pinned to their
 * reporting station. Deduplicates so the same physical train (reported
 * by multiple stations along its route) only appears once — at the
 * station with the lowest reported minutes.
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
        });
      }
    }
  }

  // Group by line color + destination to identify distinct trains
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

  for (const [, group] of groups) {
    group.sort((a, b) => a.minutes - b.minutes);

    let lastPlacedMin = -Infinity;
    let trainIdx = 0;

    for (const sighting of group) {
      if (sighting.minutes - lastPlacedMin < DEDUP_GAP) continue;

      trains.push({
        id: `${sighting.color.toUpperCase()}-${sighting.destAbbr}-${trainIdx}`,
        stationAbbr: sighting.stationAbbr,
        color: sighting.color,
        hexcolor: sighting.hexcolor,
        destination: sighting.destination,
        destAbbr: sighting.destAbbr,
        minutes: sighting.minutes,
      });

      lastPlacedMin = sighting.minutes;
      trainIdx++;
    }
  }

  return trains;
}
