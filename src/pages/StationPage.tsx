import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { STATION_MAP } from '@/components/map/map-data';
import { useAppStore } from '@/store/app-store';
import { useStations } from '@/api/hooks';
import { DirectionFilter } from '@/components/filters/DirectionFilter';
import { DepartureBoard } from '@/components/panels/DepartureBoard';
import { ElevatorStatus } from '@/components/panels/ElevatorStatus';
import { PixelDivider } from '@/components/chrome/PixelDivider';
import { RetroButton } from '@/components/chrome/RetroButton';
import { getLinesForStation } from '@/components/map/map-data';
import styles from './StationPage.module.css';

export function StationPage() {
  const { abbr } = useParams<{ abbr: string }>();
  const navigate = useNavigate();
  const selectStation = useAppStore((s) => s.selectStation);
  const { data: stations } = useStations();

  useEffect(() => {
    if (abbr && STATION_MAP.has(abbr)) {
      selectStation(abbr);
    }
  }, [abbr, selectStation]);

  if (!abbr || !STATION_MAP.has(abbr)) {
    return <Navigate to="/map" replace />;
  }

  const meta = stations?.find((s) => s.abbr === abbr);
  const lines = getLinesForStation(abbr);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <RetroButton type="button" variant="back" onClick={() => navigate('/map')}>
          ← Map
        </RetroButton>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{meta?.name ?? abbr}</h1>
          <p className={styles.sub}>{abbr}</p>
        </div>
      </header>

      {meta && (
        <address className={styles.address}>
          {meta.address}, {meta.city}, {meta.state} {meta.zipcode}
        </address>
      )}

      <div className={styles.lines}>
        {lines.map((line) => (
          <span
            key={line.color}
            className={styles.chip}
            style={{ borderColor: line.hexcolor, color: line.hexcolor }}
          >
            {line.name}
          </span>
        ))}
      </div>

      <PixelDivider />

      <div className={styles.grid}>
        <div className={styles.col}>
          <div className={styles.departuresStack}>
            <DirectionFilter compact />
            <DepartureBoard forcedStation={abbr} />
          </div>
        </div>
        <div className={styles.col}>
          <ElevatorStatus stationAbbr={abbr} stationName={meta?.name} />
        </div>
      </div>
    </div>
  );
}
