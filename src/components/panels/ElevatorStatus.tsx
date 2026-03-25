import { useElevatorStatus } from '@/api/hooks';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import styles from './ElevatorStatus.module.css';

interface ElevatorStatusProps {
  stationAbbr: string;
  stationName?: string;
}

function matchesStation(
  itemStation: string,
  abbr: string,
  fullName: string | undefined,
  description: string,
): boolean {
  const s = itemStation.trim().toUpperCase();
  const a = abbr.trim().toUpperCase();
  const desc = description.trim().toUpperCase();
  if (!s) return false;
  if (s === 'ALL' || s === 'SYSTEM' || s === 'SYSTEMWIDE') return false;
  if (s === a) return true;
  if (s === 'BART' && desc) {
    if (a && desc.includes(a)) return true;
    if (fullName) {
      const n = fullName.trim().toUpperCase();
      if (n && desc.includes(n)) return true;
    }
  }
  if (fullName) {
    const n = fullName.trim().toUpperCase();
    if (n && (s.includes(n) || n.includes(s))) return true;
  }
  return s.includes(a);
}

export function ElevatorStatus({ stationAbbr, stationName }: ElevatorStatusProps) {
  const { data: items, isLoading, isError } = useElevatorStatus();

  const relevant =
    items?.filter(
      (e) =>
        matchesStation(e.station, stationAbbr, stationName, e.description) &&
        e.description.trim(),
    ) ?? [];

  return (
    <RetroWindow title="Elevators & accessibility">
      {isLoading ? (
        <p className={styles.muted}>Loading elevator status…</p>
      ) : isError ? (
        <p className={styles.muted}>Could not load elevator data.</p>
      ) : relevant.length === 0 ? (
        <p className={styles.muted}>No elevator notices for this station.</p>
      ) : (
        <ul className={styles.list}>
          {relevant.map((e, i) => (
            <li key={`${e.station}-${e.posted}-${i}`} className={styles.item}>
              <span className={styles.station}>{e.station}</span>
              <span className={styles.desc}>{e.description}</span>
            </li>
          ))}
        </ul>
      )}
    </RetroWindow>
  );
}
