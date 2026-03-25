import { stationLabelAnchoredLeft, type MapStation } from './map-data';
import styles from './Map.module.css';

const STATION_SIZE = 24;
const HALF = STATION_SIZE / 2;
const SELECTED_PAD = 7;
/** Gap between square dot and label — larger so text sits clearer of track geometry. */
const LABEL_GAP = 17;

/**
 * Labels default to the right of the dot. On the western (SF) trunk and far-east
 * branches, flip to the left so text grows into open map space instead of across lines.
 */
function stationAbbrevLayout(station: MapStation): {
  labelX: number;
  labelAnchor: 'start' | 'end';
  baselineY: number;
  hitRect: { x: number; y: number; width: number; height: number };
} {
  const { x: cx, y: cy } = station;
  const { x: labelX, anchor: labelAnchor } = stationLabelAnchoredLeft(cx)
    ? { x: cx - HALF - LABEL_GAP, anchor: 'end' as const }
    : { x: cx + HALF + LABEL_GAP, anchor: 'start' as const };

  const baselineY = cy + 9;
  const hitH = 15;
  const hitW = 46;
  const hitY = baselineY - 11;
  const hitRect =
    labelAnchor === 'end'
      ? { x: labelX - hitW, y: hitY, width: hitW, height: hitH }
      : { x: labelX - 2, y: hitY, width: hitW, height: hitH };

  return { labelX, labelAnchor, baselineY, hitRect };
}

interface StationDotBodyProps {
  station: MapStation;
  isSelected: boolean;
  isHovered: boolean;
  trainCount: number;
  onSelect: (abbr: string) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function StationDotBody({
  station,
  isSelected,
  isHovered,
  trainCount,
  onSelect,
  onPointerEnter,
  onPointerLeave,
}: StationDotBodyProps) {
  const { x: cx, y: cy } = station;
  const dotClass =
    isSelected ? styles.stationDotSelected : isHovered ? styles.stationDotHover : styles.stationDot;

  return (
    <g
      className={styles.stationGroup}
      onClick={() => onSelect(station.abbr)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <title>{station.name}</title>
      {isSelected && (
        <rect
          x={cx - HALF - SELECTED_PAD}
          y={cy - HALF - SELECTED_PAD}
          width={STATION_SIZE + SELECTED_PAD * 2}
          height={STATION_SIZE + SELECTED_PAD * 2}
          rx={3}
          className={styles.stationSelectedRing}
        />
      )}

      <rect
        x={cx - HALF}
        y={cy - HALF}
        width={STATION_SIZE}
        height={STATION_SIZE}
        rx={3}
        className={dotClass}
      />

      {trainCount > 0 && (
        <text
          x={cx}
          y={cy}
          className={`${styles.stationTrainCount} ${trainCount >= 10 ? styles.stationTrainCountSmall : ''}`}
        >
          {trainCount}
        </text>
      )}

      {/* Hit area — oversized invisible rect for easier clicking */}
      <rect
        x={cx - STATION_SIZE}
        y={cy - STATION_SIZE}
        width={STATION_SIZE * 2}
        height={STATION_SIZE * 2}
        fill="transparent"
      />
    </g>
  );
}

interface StationAbbrevProps {
  station: MapStation;
  isHovered: boolean;
  onSelect: (abbr: string) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function StationAbbrev({
  station,
  isHovered,
  onSelect,
  onPointerEnter,
  onPointerLeave,
}: StationAbbrevProps) {
  const { labelX, labelAnchor, baselineY, hitRect } = stationAbbrevLayout(station);
  const labelCls =
    `${styles.stationLabel}${isHovered ? ` ${styles.stationLabelHover}` : ''}`;

  return (
    <g
      className={styles.stationGroup}
      onClick={() => onSelect(station.abbr)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <title>{station.name}</title>
      <rect {...hitRect} fill="transparent" />
      <text x={labelX} y={baselineY} textAnchor={labelAnchor} className={labelCls}>
        {station.abbr}
      </text>
    </g>
  );
}
