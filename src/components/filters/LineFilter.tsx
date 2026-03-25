import type { CSSProperties } from 'react';
import { useAppStore } from '@/store/app-store';
import { LINE_KEYS, LINES } from '@/utils/lines';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import styles from './LineFilter.module.css';

interface LineFilterProps {
  compact?: boolean;
}

export function LineFilter({ compact = false }: LineFilterProps) {
  const activeLines = useAppStore((s) => s.activeLines);
  const toggleLine = useAppStore((s) => s.toggleLine);

  return (
    <RetroWindow title={compact ? 'Lines' : 'Line filter'} compact={compact}>
      {!compact && (
        <p className={styles.hint}>Toggle which lines are highlighted on the map and in departures.</p>
      )}
      <ul className={styles.list}>
        {LINE_KEYS.map((key) => {
          const info = LINES[key];
          const on = activeLines.has(key);
          return (
            <li key={key}>
              <button
                type="button"
                className={`${styles.row} ${on ? styles.rowOn : styles.rowOff}`}
                style={{ '--line-accent': info.hexcolor } as CSSProperties}
                onClick={() => toggleLine(key)}
                aria-pressed={on}
              >
                <span className={styles.indicator} aria-hidden>
                  {on ? '[*]' : '[ ]'}
                </span>
                <span className={styles.swatch} style={{ backgroundColor: info.hexcolor }} />
                <span className={styles.name}>{info.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </RetroWindow>
  );
}
