import { useAppStore } from '@/store/app-store';
import { LINE_KEYS, LINES } from '@/utils/lines';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import styles from './LineFilter.module.css';

export function LineFilter() {
  const activeLines = useAppStore((s) => s.activeLines);
  const toggleLine = useAppStore((s) => s.toggleLine);

  return (
    <RetroWindow title="Line filter">
      <p className={styles.hint}>Toggle which lines are highlighted on the map and in departures.</p>
      <ul className={styles.list}>
        {LINE_KEYS.map((key) => {
          const info = LINES[key];
          const on = activeLines.has(key);
          return (
            <li key={key}>
              <label className={styles.row}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={on}
                  onChange={() => toggleLine(key)}
                />
                <span className={styles.swatch} style={{ backgroundColor: info.hexcolor }} />
                <span className={styles.name}>{info.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </RetroWindow>
  );
}
