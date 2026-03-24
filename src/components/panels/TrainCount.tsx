import { useTrainCount } from '@/api/hooks';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import styles from './TrainCount.module.css';

export function TrainCount() {
  const { data: count, isLoading, isError } = useTrainCount();

  return (
    <RetroWindow title="Fleet">
      <div className={styles.row}>
        <span className={styles.label}>Trains in service</span>
        <span className={styles.value}>
          {isLoading ? '…' : isError ? '—' : count ?? '—'}
        </span>
      </div>
      <p className={styles.hint}>Updates every 30s via BART count API.</p>
    </RetroWindow>
  );
}
