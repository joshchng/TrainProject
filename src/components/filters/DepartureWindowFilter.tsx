import {
  DEPARTURE_WINDOW_OPTIONS,
  useAppStore,
  type DepartureWindowMinutes,
} from '@/store/app-store';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import { RetroButton } from '@/components/chrome/RetroButton';
import styles from './DepartureWindowFilter.module.css';

interface DepartureWindowFilterProps {
  compact?: boolean;
}

export function DepartureWindowFilter({ compact = false }: DepartureWindowFilterProps) {
  const departureWindowMinutes = useAppStore((s) => s.departureWindowMinutes);
  const setDepartureWindowMinutes = useAppStore((s) => s.setDepartureWindowMinutes);

  return (
    <RetroWindow title={compact ? 'Due within' : 'Departure window'} compact={compact}>
      {!compact && (
        <p className={styles.hint}>
          List departures and map badges for trains due within this many minutes (includes
          “Leaving”).
        </p>
      )}
      <div className={styles.buttons} role="group" aria-label="Minutes until departure">
        {DEPARTURE_WINDOW_OPTIONS.map((opt: DepartureWindowMinutes) => (
          <RetroButton
            key={opt}
            type="button"
            variant="small"
            active={departureWindowMinutes === opt}
            onClick={() => setDepartureWindowMinutes(opt)}
          >
            {opt} min
          </RetroButton>
        ))}
      </div>
    </RetroWindow>
  );
}
