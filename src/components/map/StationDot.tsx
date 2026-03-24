import { useState } from 'react';
import type { MapStation } from './map-data';
import styles from './Map.module.css';

interface StationDotProps {
  station: MapStation;
  isSelected: boolean;
  onSelect: (abbr: string) => void;
}

export function StationDot({ station, isSelected, onSelect }: StationDotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <g
      className={styles.stationGroup}
      onClick={() => onSelect(station.abbr)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {isSelected && (
        <circle
          cx={station.x}
          cy={station.y}
          r={9}
          fill="none"
          stroke="#B8A04A"
          strokeWidth={2}
          className="animate-pulse"
        />
      )}
      <circle
        cx={station.x}
        cy={station.y}
        r={5}
        fill={isSelected ? '#B8A04A' : '#F5F0E1'}
        stroke="#1A1A18"
        strokeWidth={1.5}
      />
      {hovered && (
        <g>
          <rect
            x={station.x + 10}
            y={station.y - 18}
            width={station.name.length * 6.5 + 12}
            height={22}
            rx={2}
            fill="#1A1A18"
            fillOpacity={0.92}
            stroke="#6B4226"
            strokeWidth={1}
          />
          <text
            x={station.x + 16}
            y={station.y - 3}
            fill="#F5F0E1"
            fontSize={11}
            fontFamily="var(--font-ui)"
          >
            {station.name}
          </text>
        </g>
      )}
    </g>
  );
}
