import { SystemMap } from '@/components/map/SystemMap';
import { AlertTicker } from '@/components/panels/AlertTicker';
import { StationInfo } from '@/components/panels/StationInfo';
import { DepartureBoard } from '@/components/panels/DepartureBoard';
import { TrainCount } from '@/components/panels/TrainCount';
import { LineFilter } from '@/components/filters/LineFilter';
import { DirectionFilter } from '@/components/filters/DirectionFilter';
import styles from './Home.module.css';

export function Home() {
  return (
    <div className={styles.page}>
      <AlertTicker />
      <div className={styles.body}>
        <section className={styles.mapArea} aria-label="BART system map">
          <SystemMap />
        </section>
        <aside className={styles.sidebar}>
          <StationInfo />
          <DepartureBoard />
          <TrainCount />
          <LineFilter />
          <DirectionFilter />
        </aside>
      </div>
    </div>
  );
}
