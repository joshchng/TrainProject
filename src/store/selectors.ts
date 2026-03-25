import type { ETDResponse } from '@/api/types';
import type { DirectionFilter } from './app-store';
import { LINES } from '@/components/map/map-data';

/** Station abbreviations on a given line color key (e.g. `YELLOW`). */
export function stationAbbrevsForLine(lineColor: string): string[] {
  const line = LINES.find((l) => l.color === lineColor);
  return line?.stations ?? [];
}

export interface FlatDeparture {
  destination: string;
  abbreviation: string;
  minutes: number | 'Leaving';
  platform: number;
  direction: 'North' | 'South';
  length: number;
  color: string;
  hexcolor: string;
  bikeflag: boolean;
  delay: number;
  /** Set when merging system-wide ETDs so rows can show originating station. */
  originAbbr?: string;
  originName?: string;
}

function sortFlatDepartures(flat: FlatDeparture[]): FlatDeparture[] {
  flat.sort((a, b) => {
    const aMin = a.minutes === 'Leaving' ? 0 : a.minutes;
    const bMin = b.minutes === 'Leaving' ? 0 : b.minutes;
    if (aMin !== bMin) return aMin - bMin;
    const oa = a.originAbbr ?? '';
    const ob = b.originAbbr ?? '';
    return oa.localeCompare(ob);
  });
  return flat;
}

function flatDeparturesForStation(
  etd: ETDResponse,
  activeLines: Set<string>,
  directionFilter: DirectionFilter,
  withOrigin: boolean,
): FlatDeparture[] {
  const flat: FlatDeparture[] = [];

  for (const dest of etd.destinations) {
    for (const est of dest.estimates) {
      if (!activeLines.has(est.color.toUpperCase())) continue;
      if (directionFilter !== 'all' && est.direction !== directionFilter) continue;

      flat.push({
        destination: dest.destination,
        abbreviation: dest.abbreviation,
        minutes: est.minutes,
        platform: est.platform,
        direction: est.direction,
        length: est.length,
        color: est.color,
        hexcolor: est.hexcolor,
        bikeflag: est.bikeflag,
        delay: est.delay,
        ...(withOrigin
          ? { originAbbr: etd.stationAbbr, originName: etd.stationName }
          : {}),
      });
    }
  }

  return flat;
}

export function filterDepartures(
  etd: ETDResponse | undefined,
  activeLines: Set<string>,
  directionFilter: DirectionFilter,
): FlatDeparture[] {
  if (!etd) return [];
  return sortFlatDepartures(flatDeparturesForStation(etd, activeLines, directionFilter, false));
}

export function filterAllStationsDepartures(
  etds: ETDResponse[] | undefined,
  activeLines: Set<string>,
  directionFilter: DirectionFilter,
): FlatDeparture[] {
  if (!etds?.length) return [];
  const flat: FlatDeparture[] = [];
  for (const etd of etds) {
    flat.push(...flatDeparturesForStation(etd, activeLines, directionFilter, true));
  }
  return sortFlatDepartures(flat);
}
