import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { useAllDepartures } from '@/api/hooks';
import { STATIONS, LINES, OAK_CONNECTOR, STATION_MAP } from './map-data';
import { interpolateTrains } from './train-interpolation';
import { LinePath } from './LinePath';
import { StationDot } from './StationDot';
import { TrainBlip } from './TrainBlip';
import styles from './Map.module.css';

export function SystemMap() {
  const selectedStation = useAppStore((s) => s.selectedStation);
  const activeLines = useAppStore((s) => s.activeLines);
  const selectStation = useAppStore((s) => s.selectStation);

  const { data: allETDs } = useAllDepartures();

  const trains = useMemo(
    () => (allETDs ? interpolateTrains(allETDs) : []),
    [allETDs],
  );

  const visibleTrains = useMemo(
    () => trains.filter((t) => activeLines.has(t.color.toUpperCase())),
    [trains, activeLines],
  );

  const oakFrom = STATION_MAP.get(OAK_CONNECTOR.from);
  const oakTo = STATION_MAP.get(OAK_CONNECTOR.to);

  return (
    <div className={styles.mapContainer}>
      <svg
        viewBox="0 0 800 620"
        className={styles.mapSvg}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Line paths (render behind everything) */}
        {LINES.map((line) => (
          <LinePath
            key={line.color}
            line={line}
            active={activeLines.has(line.color)}
          />
        ))}

        {/* Oakland Airport connector */}
        {oakFrom && oakTo && (
          <line
            x1={oakFrom.x}
            y1={oakFrom.y}
            x2={oakTo.x}
            y2={oakTo.y}
            stroke={OAK_CONNECTOR.color}
            strokeWidth={2}
            strokeDasharray="4 3"
            opacity={0.6}
          />
        )}

        {/* Train blips (on top of lines, behind station dots) */}
        {visibleTrains.map((train) => (
          <TrainBlip
            key={train.id}
            x={train.x}
            y={train.y}
            color={train.hexcolor}
          />
        ))}

        {/* Station dots (top layer) */}
        {STATIONS.map((station) => (
          <StationDot
            key={station.abbr}
            station={station}
            isSelected={selectedStation === station.abbr}
            onSelect={selectStation}
          />
        ))}
      </svg>
    </div>
  );
}
