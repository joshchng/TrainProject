import { AnimatePresence, motion } from 'framer-motion';
import { useAllDepartures, useDepartures } from '@/api/hooks';
import { useAppStore } from '@/store/app-store';
import {
  filterAllStationsDepartures,
  filterDepartures,
  type FlatDeparture,
} from '@/store/selectors';
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

function DepartureRow({
  departure,
  showOrigin,
}: {
  departure: FlatDeparture;
  showOrigin?: boolean;
}) {
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
      {showOrigin && (
        <td className={styles.cellFrom} title={departure.originName}>
          <span className={styles.fromAbbr}>{departure.originAbbr ?? '—'}</span>
        </td>
      )}
      <td className={styles.cellDest}>
        <div className={styles.cellDestInner}>
          <span
            className={styles.lineColorDot}
            style={{ backgroundColor: departure.hexcolor }}
          />
          <FlipCell value={departure.destination} />
        </div>
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
  forcedStation?: string | null;
  fillHeight?: boolean;
}

export function DepartureBoard({ forcedStation, fillHeight }: DepartureBoardProps) {
  const selectedStation = useAppStore((s) => s.selectedStation);
  const viewAllDepartures = useAppStore((s) => s.viewAllDepartures);
  const activeStation = forcedStation ?? selectedStation;
  const showSystemWide = viewAllDepartures && !forcedStation;
  const activeLines = useAppStore((s) => s.activeLines);
  const directionFilter = useAppStore((s) => s.directionFilter);

  const { data: allEtds, isLoading: loadingAll } = useAllDepartures();
  const { data: etdData, isLoading: loadingOne } = useDepartures(
    showSystemWide ? null : activeStation,
  );

  const departures = showSystemWide
    ? filterAllStationsDepartures(allEtds, activeLines, directionFilter)
    : filterDepartures(etdData, activeLines, directionFilter);

  const isLoading = showSystemWide ? loadingAll : loadingOne;

  const winClass = fillHeight ? styles.windowFill : '';
  const bodyClass = fillHeight ? styles.windowBody : '';

  if (!activeStation && !showSystemWide) {
    return (
      <RetroWindow title="Departures" className={winClass} contentClassName={bodyClass}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>&#9654;</span>
          Select a station on the map
        </div>
      </RetroWindow>
    );
  }

  const title = showSystemWide
    ? 'Departures — All departures'
    : `Departures — ${etdData?.stationName ?? activeStation}`;

  return (
    <RetroWindow title={title} className={winClass} contentClassName={bodyClass}>
      {isLoading ? (
        <div className={styles.loading}>Loading departures...</div>
      ) : departures.length === 0 ? (
        <div className={styles.empty}>No departures found</div>
      ) : (
        <div className={`${styles.tableWrapper} ${fillHeight ? styles.tableWrapperFill : ''}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                {showSystemWide && <th className={styles.headerFrom}>From</th>}
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
                    key={`${dep.originAbbr ?? ''}-${dep.abbreviation}-${dep.direction}-${dep.destination}-${i}`}
                    departure={dep}
                    showOrigin={showSystemWide}
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
