import type {
  Station,
  ETDResponse,
  Route,
  Advisory,
  ElevatorStatus,
  RawStationResponse,
  RawETDResponse,
  RawRouteResponse,
  RawRouteDetailResponse,
  RawAdvisoryResponse,
  RawTrainCountResponse,
  RawElevatorResponse,
} from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function parseMinutes(raw: string): number | 'Leaving' {
  const t = String(raw).trim();
  if (t === 'Leaving' || t === 'Due' || t === '0' || t === '') return 'Leaving';
  const n = parseInt(t, 10);
  if (!Number.isFinite(n)) return 'Leaving';
  return n;
}

function safeInt(raw: string, fallback = 0): number {
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : fallback;
}

async function fetchEndpoint<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`BART API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

function extractCdata(value: { '#cdata-section': string } | string): string {
  if (typeof value === 'string') return value;
  return value['#cdata-section'] ?? '';
}

export async function getStations(): Promise<Station[]> {
  const data = await fetchEndpoint<RawStationResponse>('stn', { cmd: 'stns' });
  return asArray(data.root.stations.station).map((s) => ({
    name: s.name,
    abbr: s.abbr,
    lat: parseFloat(s.gtfs_latitude),
    lng: parseFloat(s.gtfs_longitude),
    address: s.address,
    city: s.city,
    county: s.county,
    state: s.state,
    zipcode: s.zipcode,
  }));
}

export async function getETD(station: string): Promise<ETDResponse> {
  const data = await fetchEndpoint<RawETDResponse>('etd', { cmd: 'etd', orig: station });
  const stn = asArray(data.root.station)[0];
  if (!stn) {
    return { stationName: '', stationAbbr: station, destinations: [] };
  }

  return {
    stationName: stn.name,
    stationAbbr: stn.abbr,
    destinations: asArray(stn.etd).map((etd) => ({
      destination: etd.destination,
      abbreviation: etd.abbreviation,
      estimates: asArray(etd.estimate).map((est) => ({
        minutes: parseMinutes(est.minutes),
        platform: safeInt(est.platform, 0),
        direction: (est.direction === 'North' || est.direction === 'South'
          ? est.direction
          : 'North') as 'North' | 'South',
        length: safeInt(est.length, 0),
        color: est.color,
        hexcolor: est.hexcolor,
        bikeflag: est.bikeflag === '1',
        delay: safeInt(est.delay, 0),
        cancelflag: est.cancelflag === '1',
      })),
    })),
  };
}

export async function getAllETDs(): Promise<ETDResponse[]> {
  const data = await fetchEndpoint<RawETDResponse>('etd', { cmd: 'etd', orig: 'ALL' });
  return asArray(data.root.station).map((stn) => ({
    stationName: stn.name,
    stationAbbr: stn.abbr,
    destinations: asArray(stn.etd).map((etd) => ({
      destination: etd.destination,
      abbreviation: etd.abbreviation,
      estimates: asArray(etd.estimate).map((est) => ({
        minutes: parseMinutes(est.minutes),
        platform: safeInt(est.platform, 0),
        direction: (est.direction === 'North' || est.direction === 'South'
          ? est.direction
          : 'North') as 'North' | 'South',
        length: safeInt(est.length, 0),
        color: est.color,
        hexcolor: est.hexcolor,
        bikeflag: est.bikeflag === '1',
        delay: safeInt(est.delay, 0),
        cancelflag: est.cancelflag === '1',
      })),
    })),
  }));
}

export async function getRoutes(): Promise<Route[]> {
  const data = await fetchEndpoint<RawRouteResponse>('route', { cmd: 'routes' });
  const routeSummaries = asArray(data.root.routes.route);

  const detailed = await Promise.all(
    routeSummaries.map(async (r) => {
      const detail = await fetchEndpoint<RawRouteDetailResponse>('route', {
        cmd: 'routeinfo',
        route: r.number,
      });
      const rawInfo = detail.root.routes.route;
      const info = Array.isArray(rawInfo) ? rawInfo[0] : rawInfo;
      if (!info) {
        throw new Error(`Missing route info for route ${r.number}`);
      }
      return {
        name: info.name,
        abbr: info.abbr,
        routeID: info.routeID,
        number: parseInt(info.number, 10),
        color: info.color,
        hexcolor: info.hexcolor,
        stations: asArray(info.config?.station),
      };
    }),
  );

  return detailed;
}

export async function getAdvisories(): Promise<Advisory[]> {
  const data = await fetchEndpoint<RawAdvisoryResponse>('bsa', { cmd: 'bsa' });
  return asArray(data.root.bsa).map((a) => ({
    id: a.id ?? '',
    station: a.station ?? '',
    type: a.type ?? '',
    description: extractCdata(a.description),
    posted: a.posted ?? '',
    expires: a.expires ?? '',
  }));
}

export async function getTrainCount(): Promise<number> {
  const data = await fetchEndpoint<RawTrainCountResponse>('count', { cmd: 'count' });
  return safeInt(data.root.traincount, 0);
}

export async function getElevatorStatus(): Promise<ElevatorStatus[]> {
  const data = await fetchEndpoint<RawElevatorResponse>('elev', { cmd: 'elev' });
  return asArray(data.root.bsa).map((e) => ({
    station: e.station ?? '',
    description: extractCdata(e.description),
    type: e.type ?? '',
    posted: e.posted ?? '',
    expires: e.expires ?? '',
  }));
}
