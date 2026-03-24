import { STATION_MAP } from '@/components/map/map-data';

export function stationDisplayName(abbr: string): string {
  return STATION_MAP.get(abbr)?.name ?? abbr;
}
