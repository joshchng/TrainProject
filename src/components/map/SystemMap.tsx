import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { useAllDepartures } from '@/api/hooks';
import {
  STATIONS,
  STATION_MAP,
  MAP_VIEWBOX,
  computeAllLineSegments,
  type OffsetSegment,
} from './map-data';
import { getStationTrains, type TrainAtStation } from './station-trains';
import { StationDot } from './StationDot';
import { TrainMarker } from './TrainMarker';
import styles from './Map.module.css';

const FAN_RADIUS = 23;

/**
 * Arranges N train markers in a ring around a station center so they
 * don't stack on top of each other.
 */
function fanOutPosition(
  cx: number,
  cy: number,
  index: number,
  total: number,
): { x: number; y: number } {
  if (total === 1) return { x: cx + FAN_RADIUS, y: cy };
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    x: cx + Math.cos(angle) * FAN_RADIUS,
    y: cy + Math.sin(angle) * FAN_RADIUS,
  };
}

export function SystemMap() {
  const selectedStation = useAppStore((s) => s.selectedStation);
  const activeLines = useAppStore((s) => s.activeLines);
  const selectStation = useAppStore((s) => s.selectStation);

  const { data: allETDs } = useAllDepartures();

  const allSegments = useMemo(() => computeAllLineSegments(), []);

  const visibleSegments = useMemo(
    () => allSegments.filter((seg) => activeLines.has(seg.lineColor)),
    [allSegments, activeLines],
  );

  const trains = useMemo(
    () => (allETDs ? getStationTrains(allETDs) : []),
    [allETDs],
  );

  const visibleTrains = useMemo(
    () => trains.filter((t) => activeLines.has(t.color.toUpperCase())),
    [trains, activeLines],
  );

  // Group trains by station for fan-out and count badge
  const trainsByStation = useMemo(() => {
    const map = new Map<string, TrainAtStation[]>();
    for (const t of visibleTrains) {
      let arr = map.get(t.stationAbbr);
      if (!arr) {
        arr = [];
        map.set(t.stationAbbr, arr);
      }
      arr.push(t);
    }
    return map;
  }, [visibleTrains]);

  const { width: vbW, height: vbH } = MAP_VIEWBOX;

  return (
    <div className={styles.mapContainer}>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className={styles.mapSvg}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="BART system map with live train positions"
      >
        <rect width={vbW} height={vbH} className={styles.mapBackground} />

        {/* Line segments — drawn first so stations render on top */}
        {visibleSegments.map((seg: OffsetSegment) => (
          <line
            key={`${seg.lineColor}-${seg.fromAbbr}-${seg.toAbbr}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke={seg.hexcolor}
            strokeWidth={3.5}
            className={styles.lineSegment}
          />
        ))}

        {/* Station dots */}
        {STATIONS.map((station) => (
          <StationDot
            key={station.abbr}
            station={station}
            isSelected={selectedStation === station.abbr}
            onSelect={selectStation}
          />
        ))}

        {/* Train markers — fanned out around their station */}
        {Array.from(trainsByStation.entries()).map(([stAbbr, stTrains]) => {
          const station = STATION_MAP.get(stAbbr);
          if (!station) return null;
          return stTrains.map((train, idx) => {
            const pos = fanOutPosition(station.x, station.y, idx, stTrains.length);
            return (
              <TrainMarker
                key={train.id}
                cx={pos.x}
                cy={pos.y}
                color={train.hexcolor}
              />
            );
          });
        })}
      </svg>
    </div>
  );
}
