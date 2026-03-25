import { SystemMap } from '@/components/map/SystemMap';
import { AlertTicker } from '@/components/panels/AlertTicker';
import { StationInfo } from '@/components/panels/StationInfo';
import { DepartureBoard } from '@/components/panels/DepartureBoard';
import { TrainCount } from '@/components/panels/TrainCount';
import { LineFilter } from '@/components/filters/LineFilter';
import { DirectionFilter } from '@/components/filters/DirectionFilter';
import styles from './MapPage.module.css';

export function MapPage() {
  return (
    <div className={styles.page}>
      <AlertTicker />
      <div className={styles.body}>
        <section className={styles.mapStage} aria-label="BART system map">
          <SystemMap fillHeight />
        </section>
        <div className={styles.toolRail} aria-label="Map controls">
          <TrainCount compact />
          <LineFilter compact />
          <DirectionFilter compact />
        </div>
        <aside className={styles.dataRail} aria-label="Station and departures">
          <div className={styles.dataIntro}>
            <StationInfo />
          </div>
          <div className={styles.dataDepartures}>
            <DepartureBoard fillHeight />
          </div>
        </aside>
      </div>
    </div>
  );
}
