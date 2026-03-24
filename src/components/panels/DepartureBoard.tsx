import { AnimatePresence, motion } from 'framer-motion';
import { useDepartures } from '@/api/hooks';
import { useAppStore } from '@/store/app-store';
import { filterDepartures, type FlatDeparture } from '@/store/selectors';
import { formatMinutes } from '@/utils/time';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import styles from './DepartureBoard.module.css';

function FlipCell({ value, className = '' }: { value: string; className?: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        className={`${styles.flipCell} ${className}`}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: -90, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

function DepartureRow({ departure }: { departure: FlatDeparture }) {
  const minuteStr = formatMinutes(departure.minutes);
  const isLeaving = departure.minutes === 'Leaving' || departure.minutes === 0;

  return (
    <motion.tr
      layout
      className={styles.row}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <td className={styles.cellDest}>
        <span
          className={styles.lineColorDot}
          style={{ backgroundColor: departure.hexcolor }}
        />
        <FlipCell value={departure.destination} />
      </td>
      <td className={`${styles.cellMin} ${isLeaving ? styles.leaving : ''}`}>
        <FlipCell value={minuteStr} className={isLeaving ? styles.leaving : ''} />
      </td>
      <td className={styles.cellPlat}>
        <FlipCell value={String(departure.platform)} />
      </td>
      <td className={styles.cellLen}>
        <FlipCell value={`${departure.length} car`} />
      </td>
    </motion.tr>
  );
}

interface DepartureBoardProps {
  /** When set, shows ETDs for this station (e.g. station detail route). Otherwise uses map selection. */
  forcedStation?: string | null;
}

export function DepartureBoard({ forcedStation }: DepartureBoardProps) {
  const selectedStation = useAppStore((s) => s.selectedStation);
  const activeStation = forcedStation ?? selectedStation;
  const activeLines = useAppStore((s) => s.activeLines);
  const directionFilter = useAppStore((s) => s.directionFilter);
  const { data: etdData, isLoading } = useDepartures(activeStation);

  const departures = filterDepartures(etdData, activeLines, directionFilter);

  if (!activeStation) {
    return (
      <RetroWindow title="Departures">
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>&#9654;</span>
          Select a station on the map
        </div>
      </RetroWindow>
    );
  }

  return (
    <RetroWindow title={`Departures — ${etdData?.stationName ?? activeStation}`}>
      {isLoading ? (
        <div className={styles.loading}>Loading departures...</div>
      ) : departures.length === 0 ? (
        <div className={styles.empty}>No departures found</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.headerDest}>Destination</th>
                <th className={styles.headerMin}>Min</th>
                <th className={styles.headerPlat}>Plat</th>
                <th className={styles.headerLen}>Cars</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {departures.map((dep, i) => (
                  <DepartureRow
                    key={`${dep.abbreviation}-${dep.direction}-${i}`}
                    departure={dep}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </RetroWindow>
  );
}
