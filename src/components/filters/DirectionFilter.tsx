import { useAppStore, type DirectionFilter } from '@/store/app-store';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import { RetroButton } from '@/components/chrome/RetroButton';
import styles from './DirectionFilter.module.css';

const OPTIONS: { value: DirectionFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
];

export function DirectionFilter() {
  const directionFilter = useAppStore((s) => s.directionFilter);
  const setDirection = useAppStore((s) => s.setDirection);

  return (
    <RetroWindow title="Direction">
      <p className={styles.hint}>Filter departure board by train direction.</p>
      <div className={styles.buttons}>
        {OPTIONS.map((opt) => (
          <RetroButton
            key={opt.value}
            type="button"
            variant="small"
            active={directionFilter === opt.value}
            onClick={() => setDirection(opt.value)}
          >
            {opt.label}
          </RetroButton>
        ))}
      </div>
    </RetroWindow>
  );
}
