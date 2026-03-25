import { useTrainsInServiceDisplay } from '@/api/hooks';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import styles from './TrainCount.module.css';

interface TrainCountProps {
  compact?: boolean;
}

export function TrainCount({ compact = false }: TrainCountProps) {
  const trains = useTrainsInServiceDisplay();

  return (
    <RetroWindow title="Fleet" compact={compact}>
      <div className={styles.row}>
        <span className={styles.label}>Trains</span>
        <span className={styles.value}>{trains}</span>
      </div>
      {!compact && (
        <p className={styles.hint}>
          Matches direction (North / South / All): total from BART count, or an approximate share
          from system-wide imminent departures (your departure window).
        </p>
      )}
    </RetroWindow>
  );
}
