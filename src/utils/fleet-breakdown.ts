import type { ETDResponse } from '@/api/types';
import { isWithinDepartureWindow } from '@/store/selectors';

/**
 * Approximate northbound vs southbound trains in service by splitting the official
 * BART fleet total using the mix of imminent (non-cancelled) ETD estimates
 * system-wide. North + south always equals `officialTotal`.
 */
export function approximateNorthSouthFleet(
  etds: ETDResponse[] | undefined,
  officialTotal: number,
  windowMinutes: number,
): { north: number; south: number } | null {
  if (officialTotal <= 0) return { north: 0, south: 0 };
  if (!etds?.length) return null;

  let wN = 0;
  let wS = 0;
  for (const etd of etds) {
    for (const dest of etd.destinations) {
      for (const est of dest.estimates) {
        if (est.cancelflag) continue;
        if (!isWithinDepartureWindow(est.minutes, windowMinutes)) continue;
        if (est.direction === 'North') wN += 1;
        else wS += 1;
      }
    }
  }

  const sum = wN + wS;
  if (sum === 0) return null;

  const north = Math.round((officialTotal * wN) / sum);
  const south = officialTotal - north;
  return { north, south };
}
