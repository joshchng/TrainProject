import { useEffect, useMemo, useRef, useState } from 'react';
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
import { interpolateTrainPosition } from './train-interpolation';
import { RetroButton } from '@/components/chrome/RetroButton';
import { StationAbbrev, StationDotBody } from './StationDot';
import { TrainMarker } from './TrainMarker';
import styles from './Map.module.css';

const TICK_INTERVAL_MS = 500;

/** Trains within this many (adjusted) minutes of a station use the fan-out. */
const NEAR_STATION_MIN = 0.5;
const FAN_RADIUS = 20;

/**
 * Arranges N train markers in a ring around a station center so they
 * don't stack on top of each other. Positions point away from the station
 * label so dots don't cover abbreviations.
 */
function fanOutPosition(
  cx: number,
  cy: number,
  index: number,
  total: number,
): { x: number; y: number } {
  const labelLeft = stationLabelAnchoredLeft(cx);
  if (total === 1) {
    return { x: labelLeft ? cx + FAN_RADIUS : cx - FAN_RADIUS, y: cy };
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
  const viewAllDepartures = useAppStore((s) => s.viewAllDepartures);
  const activeLines = useAppStore((s) => s.activeLines);
  const selectStation = useAppStore((s) => s.selectStation);
  const showAllStationsDepartures = useAppStore((s) => s.showAllStationsDepartures);

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

  // Track when ETD data was fetched so we can count down minutes in real time
  const fetchedAtRef = useRef(Date.now());
  useEffect(() => {
    if (allETDs) fetchedAtRef.current = Date.now();
  }, [allETDs]);

  // Animation tick — increments every ~2s to re-render with updated elapsed time
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Hybrid positioning: fan-out at stations, interpolation in transit.
  // Trains near a station (adjustedMin < threshold) get the organized ring
  // layout; trains between stations glide along their line path.
  const trainPositions = useMemo(() => {
    const elapsedMin = (Date.now() - fetchedAtRef.current) / 60_000;

    const withAdjusted = visibleTrains.map((train) => ({
      train,
      adjusted: Math.max(0, train.minutes - elapsedMin),
    }));

    // Bucket trains near a station for fan-out
    const atStation = new Map<string, TrainAtStation[]>();
    const inTransit: { train: TrainAtStation; adjusted: number }[] = [];

    for (const item of withAdjusted) {
      if (item.adjusted < NEAR_STATION_MIN) {
        const arr = atStation.get(item.train.stationAbbr) ?? [];
        arr.push(item.train);
        atStation.set(item.train.stationAbbr, arr);
      } else {
        inTransit.push(item);
      }
    }

    const result: { train: TrainAtStation; x: number; y: number }[] = [];

    // At-station trains: organized fan-out ring
    for (const [abbr, group] of atStation) {
      const st = STATION_MAP.get(abbr);
      if (!st) continue;
      for (let i = 0; i < group.length; i++) {
        const pos = fanOutPosition(st.x, st.y, i, group.length);
        result.push({ train: group[i], ...pos });
      }
    }

    // In-transit trains: interpolated along line path
    for (const { train, adjusted } of inTransit) {
      const pos = interpolateTrainPosition(train, adjusted);
      result.push({ train, ...pos });
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTrains, tick]);

  const { minX: vbX, minY: vbY, width: vbW, height: vbH } = MAP_VIEWBOX;

  const [hoveredAbbr, setHoveredAbbr] = useState<string | null>(null);

  return (
    <div className={`${styles.mapContainer} ${fillHeight ? styles.mapContainerFill : ''}`}>
      <div className={styles.mapToolbar}>
        <RetroButton
          type="button"
          variant="small"
          active={viewAllDepartures}
          className={styles.mapAllStationsBtn}
          aria-pressed={viewAllDepartures}
          onClick={() => showAllStationsDepartures()}
        >
          All departures
        </RetroButton>
      </div>
      <svg
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        className={styles.mapSvg}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="BART system map with live train positions"
      >
        <rect x={vbX} y={vbY} width={vbW} height={vbH} className={styles.mapBackground} />

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

        {/* Station squares — under trains and labels */}
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

        {/* Train markers — on top of stations so dots are visible at/near stations */}
        {trainPositions.map(({ train, x, y }) => (
          <TrainMarker
            key={train.id}
            cx={x}
            cy={y}
            color={train.hexcolor}
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
