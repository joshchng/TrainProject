import { useTrainCount } from '@/api/hooks';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import styles from './TrainCount.module.css';

interface TrainCountProps {
  compact?: boolean;
}

export function TrainCount({ compact = false }: TrainCountProps) {
  const { data: count, isLoading, isError } = useTrainCount();

  return (
    <RetroWindow title="Fleet" compact={compact}>
      <div className={styles.row}>
        <span className={styles.label}>{compact ? 'In service' : 'Trains in service'}</span>
        <span className={styles.value}>
          {isLoading ? '…' : isError ? '—' : count ?? '—'}
        </span>
      </div>
      {!compact && <p className={styles.hint}>Updates every 30s via BART count API.</p>}
    </RetroWindow>
  );
}
