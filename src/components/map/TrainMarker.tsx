import styles from './Map.module.css';

interface TrainMarkerProps {
  cx: number;
  cy: number;
  color: string;
}

const TRAIN_RADIUS = 4.5;

export function TrainMarker({ cx, cy, color }: TrainMarkerProps) {
  return (
    <g className={styles.trainMarker}>
      <circle
        cx={cx}
        cy={cy}
        r={TRAIN_RADIUS}
        fill={color}
        className={styles.trainDotOutline}
        strokeWidth={1.2}
      />
    </g>
  );
}
