import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { useAllDepartures } from '@/api/hooks';
import {
  STATIONS,
  STATION_MAP,
  MAP_VIEWBOX,
  stationLabelAnchoredLeft,
  computeLinePaths,
  type LinePath,
} from './map-data';
import { getStationTrains, type TrainAtStation } from './station-trains';
import { StationAbbrev, StationDotBody } from './StationDot';
import { TrainMarker } from './TrainMarker';
import styles from './Map.module.css';

const FAN_RADIUS = 23;

/**
 * Arranges N train markers in a ring around a station center so they
 * don't stack on top of each other. The first positions point away from
 * the station label so dots don't cover abbreviations (e.g. NCON).
 */
function fanOutPosition(
  cx: number,
  cy: number,
  index: number,
  total: number,
): { x: number; y: number } {
  const labelLeft = stationLabelAnchoredLeft(cx);
  if (total === 1) {
    const x = labelLeft ? cx + FAN_RADIUS : cx - FAN_RADIUS;
    return { x, y: cy };
  }
  const baseAngle = labelLeft ? 0 : Math.PI;
  const angle = baseAngle + (2 * Math.PI * index) / total;
  return {
    x: cx + Math.cos(angle) * FAN_RADIUS,
    y: cy + Math.sin(angle) * FAN_RADIUS,
  };
}

interface SystemMapProps {
  /** Expand vertically to fill the map stage (home page grid). */
  fillHeight?: boolean;
}

export function SystemMap({ fillHeight = false }: SystemMapProps) {
  const selectedStation = useAppStore((s) => s.selectedStation);
  const activeLines = useAppStore((s) => s.activeLines);
  const selectStation = useAppStore((s) => s.selectStation);

  const { data: allETDs } = useAllDepartures();

  const allPaths = useMemo(() => computeLinePaths(), []);

  const visiblePaths = useMemo(
    () => allPaths.filter((p) => activeLines.has(p.lineColor)),
    [allPaths, activeLines],
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

  const [hoveredAbbr, setHoveredAbbr] = useState<string | null>(null);

  return (
    <div className={`${styles.mapContainer} ${fillHeight ? styles.mapContainerFill : ''}`}>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className={styles.mapSvg}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="BART system map with live train positions"
      >
        <rect width={vbW} height={vbH} className={styles.mapBackground} />

        {/* Line paths — drawn first so stations render on top */}
        {visiblePaths.map((lp: LinePath) => (
          <path
            key={lp.lineColor}
            d={lp.d}
            stroke={lp.hexcolor}
            strokeWidth={3}
            fill="none"
            strokeLinejoin="round"
            className={styles.lineSegment}
          />
        ))}

        {/* Train markers — under stations so labels stay readable */}
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

        {/* Station squares — under global label layer */}
        {STATIONS.map((station) => (
          <StationDotBody
            key={station.abbr}
            station={station}
            isSelected={selectedStation === station.abbr}
            isHovered={hoveredAbbr === station.abbr}
            onSelect={selectStation}
            onPointerEnter={() => setHoveredAbbr(station.abbr)}
            onPointerLeave={() => setHoveredAbbr(null)}
          />
        ))}

        {/* Abbrev layer last so text clears trains and other station squares */}
        {STATIONS.map((station) => (
          <StationAbbrev
            key={`${station.abbr}-abbr`}
            station={station}
            isHovered={hoveredAbbr === station.abbr}
            onSelect={selectStation}
            onPointerEnter={() => setHoveredAbbr(station.abbr)}
            onPointerLeave={() => setHoveredAbbr(null)}
          />
        ))}
      </svg>
    </div>
  );
}
