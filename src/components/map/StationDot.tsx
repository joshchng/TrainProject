import type { MapStation } from './map-data';
import styles from './Map.module.css';

interface StationDotProps {
  station: MapStation;
  isSelected: boolean;
  onSelect: (abbr: string) => void;
}

const STATION_SIZE = 24;
const HALF = STATION_SIZE / 2;
const SELECTED_PAD = 7;
/** Gap between square dot and label — larger so text sits clearer of track geometry. */
const LABEL_GAP = 17;

/**
 * Labels default to the right of the dot. On the western (SF) trunk and far-east
 * branches, flip to the left so text grows into open map space instead of across lines.
 */
function labelPlacement(cx: number): { x: number; anchor: 'start' | 'end' } {
  const labelLeft = cx < 200 || cx > 780;
  return labelLeft
    ? { x: cx - HALF - LABEL_GAP, anchor: 'end' as const }
    : { x: cx + HALF + LABEL_GAP, anchor: 'start' as const };
}

export function StationDot({ station, isSelected, onSelect }: StationDotProps) {
  const { x: cx, y: cy } = station;
  const { x: labelX, anchor: labelAnchor } = labelPlacement(cx);

  return (
    <g className={styles.stationGroup} onClick={() => onSelect(station.abbr)}>
      <title>{station.name}</title>
      {isSelected && (
        <rect
          x={cx - HALF - SELECTED_PAD}
          y={cy - HALF - SELECTED_PAD}
          width={STATION_SIZE + SELECTED_PAD * 2}
          height={STATION_SIZE + SELECTED_PAD * 2}
          rx={3}
          fill="none"
          stroke="#00AEEF"
          strokeWidth={4}
          opacity={0.8}
        />
      )}

      <rect
        x={cx - HALF}
        y={cy - HALF}
        width={STATION_SIZE}
        height={STATION_SIZE}
        rx={3}
        className={isSelected ? styles.stationDotSelected : styles.stationDot}
      />

      {/* Hit area — oversized invisible rect for easier clicking */}
      <rect
        x={cx - STATION_SIZE}
        y={cy - STATION_SIZE}
        width={STATION_SIZE * 2}
        height={STATION_SIZE * 2}
        fill="transparent"
      />

      <text
        x={labelX}
        y={cy + 9}
        textAnchor={labelAnchor}
        className={styles.stationLabel}
      >
        {station.abbr}
      </text>

    </g>
  );
}
