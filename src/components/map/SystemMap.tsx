import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { useAllDepartures } from '@/api/hooks';
import { getStationDepartureCounts } from '@/store/selectors';
import {
  STATIONS,
  MAP_VIEWBOX,
  computeLinePaths,
  type LinePath,
} from './map-data';
import { RetroButton } from '@/components/chrome/RetroButton';
import { StationAbbrev, StationDotBody } from './StationDot';
import styles from './Map.module.css';

interface SystemMapProps {
  /** Expand vertically to fill the map stage (home page grid). */
  fillHeight?: boolean;
}

export function SystemMap({ fillHeight = false }: SystemMapProps) {
  const selectedStation = useAppStore((s) => s.selectedStation);
  const viewAllDepartures = useAppStore((s) => s.viewAllDepartures);
  const activeLines = useAppStore((s) => s.activeLines);
  const directionFilter = useAppStore((s) => s.directionFilter);
  const departureWindowMinutes = useAppStore((s) => s.departureWindowMinutes);
  const selectStation = useAppStore((s) => s.selectStation);
  const showAllStationsDepartures = useAppStore((s) => s.showAllStationsDepartures);

  const { data: allETDs } = useAllDepartures();

  const allPaths = useMemo(() => computeLinePaths(), []);

  const departureCounts = useMemo(
    () =>
      getStationDepartureCounts(allETDs, activeLines, directionFilter, departureWindowMinutes),
    [allETDs, activeLines, directionFilter, departureWindowMinutes],
  );

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
        aria-label="BART system map with live train counts"
      >
        <rect x={vbX} y={vbY} width={vbW} height={vbH} className={styles.mapBackground} />

        {/* Line paths — drawn first so stations render on top; inactive lines stay visible but muted */}
        {allPaths.map((lp: LinePath) => {
          const active = activeLines.has(lp.lineColor);
          return (
            <path
              key={lp.lineColor}
              d={lp.d}
              stroke={active ? lp.hexcolor : undefined}
              strokeWidth={3}
              fill="none"
              strokeLinejoin="round"
              className={`${styles.lineSegment} ${active ? styles.lineSegmentActive : styles.lineSegmentInactive}`}
            />
          );
        })}

        {/* Station squares with approaching-train count */}
        {STATIONS.map((station) => (
          <StationDotBody
            key={station.abbr}
            station={station}
            isSelected={selectedStation === station.abbr}
            isHovered={hoveredAbbr === station.abbr}
            trainCount={departureCounts.get(station.abbr) ?? 0}
            onSelect={selectStation}
            onPointerEnter={() => setHoveredAbbr(station.abbr)}
            onPointerLeave={() => setHoveredAbbr(null)}
          />
        ))}

        {/* Abbrev layer last so text clears station squares */}
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
      <p className={styles.mapCountFootnote}>
        * Station numbers: trains due within the next {departureWindowMinutes} minutes (includes
        “Leaving”), same filters as the departures panel.
      </p>
    </div>
  );
}
