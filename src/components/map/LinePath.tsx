import { type MapLine, getLinePointsString, LINE_PATH_NUDGE } from './map-data';
import styles from './Map.module.css';

interface LinePathProps {
  line: MapLine;
  active: boolean;
}

export function LinePath({ line, active }: LinePathProps) {
  const [ox, oy] = LINE_PATH_NUDGE[line.color] ?? [0, 0];
  return (
    <g transform={`translate(${ox},${oy})`}>
      <polyline
        className={styles.linePath}
        points={getLinePointsString(line)}
        stroke={line.hexcolor}
        strokeWidth={3.5}
        strokeOpacity={active ? 1 : 0.14}
        fill="none"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
    </g>
  );
}
