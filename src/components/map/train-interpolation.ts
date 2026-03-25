import { LINES, STATION_MAP, edgeNormal, edgeOffset, type MapLine } from './map-data';
import type { TrainAtStation } from './station-trains';

const AVG_INTER_STATION_MIN = 3;

interface LineMatch {
  line: MapLine;
  stationIdx: number;
  destIdx: number;
  /** +1 if train travels toward higher indices, -1 toward lower. */
  travelDir: 1 | -1;
}

function findTrainLine(
  color: string,
  stationAbbr: string,
  destAbbr: string,
): LineMatch | null {
  const colorUpper = color.toUpperCase();
  for (const line of LINES) {
    if (line.color !== colorUpper) continue;
    const sIdx = line.stations.indexOf(stationAbbr);
    const dIdx = line.stations.indexOf(destAbbr);
    if (sIdx === -1 || dIdx === -1) continue;
    return {
      line,
      stationIdx: sIdx,
      destIdx: dIdx,
      travelDir: dIdx > sIdx ? 1 : -1,
    };
  }
  return null;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * Returns the best adjacent segment for a station on a line so we can
 * compute an offset that places the dot on its colored track rather than
 * dead-center on the station square.
 */
function findAdjacentSegment(
  line: MapLine,
  stationIdx: number,
  travelDir: 1 | -1,
): [string, string] | null {
  const stAbbr = line.stations[stationIdx];
  const prevIdx = stationIdx - travelDir;
  if (prevIdx >= 0 && prevIdx < line.stations.length) {
    return [line.stations[prevIdx], stAbbr];
  }
  const nextIdx = stationIdx + travelDir;
  if (nextIdx >= 0 && nextIdx < line.stations.length) {
    return [stAbbr, line.stations[nextIdx]];
  }
  return null;
}

export interface InterpolatedPosition {
  x: number;
  y: number;
}

/**
 * Returns an (x, y) SVG position for a train, interpolated along its line
 * path between the previous station and the reporting station.
 *
 * The dot is always offset perpendicular to the track so it sits on its
 * colored line rather than dead-center on the station square.
 */
export function interpolateTrainPosition(
  train: TrainAtStation,
  adjustedMinutes: number,
): InterpolatedPosition {
  const station = STATION_MAP.get(train.stationAbbr);
  if (!station) return { x: 0, y: 0 };

  const match = findTrainLine(train.color, train.stationAbbr, train.destAbbr);
  if (!match) {
    return { x: station.x, y: station.y };
  }

  const seg = findAdjacentSegment(match.line, match.stationIdx, match.travelDir);
  if (!seg) {
    return { x: station.x, y: station.y };
  }

  const [segA, segB] = seg;
  const n = edgeNormal(segA, segB);
  const off = edgeOffset(match.line.color, segA, segB);

  // Train is at the station — offset onto track but no interpolation
  const prevIdx = match.stationIdx - match.travelDir;
  if (
    adjustedMinutes <= 0 ||
    prevIdx < 0 ||
    prevIdx >= match.line.stations.length
  ) {
    return {
      x: station.x + n.nx * off,
      y: station.y + n.ny * off,
    };
  }

  const prevAbbr = match.line.stations[prevIdx];
  const prevStation = STATION_MAP.get(prevAbbr);
  if (!prevStation) {
    return { x: station.x + n.nx * off, y: station.y + n.ny * off };
  }

  // t: 0 = at previous station, 1 = at reporting station
  const t = 1 - clamp(adjustedMinutes / AVG_INTER_STATION_MIN, 0, 1);
  const baseX = prevStation.x + t * (station.x - prevStation.x);
  const baseY = prevStation.y + t * (station.y - prevStation.y);

  return {
    x: baseX + n.nx * off,
    y: baseY + n.ny * off,
  };
}
