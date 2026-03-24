import { Link } from 'react-router-dom';
import { useStations } from '@/api/hooks';
import { useAppStore } from '@/store/app-store';
import { getLinesForStation } from '@/components/map/map-data';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import { PixelDivider } from '@/components/chrome/PixelDivider';
import styles from './StationInfo.module.css';

export function StationInfo() {
  const selectedStation = useAppStore((s) => s.selectedStation);
  const { data: stations, isLoading } = useStations();

  if (!selectedStation) {
    return (
      <RetroWindow title="Station">
        <p className={styles.placeholder}>Click a dot on the map to select a station.</p>
      </RetroWindow>
    );
  }

  const meta = stations?.find((s) => s.abbr === selectedStation);
  const lines = getLinesForStation(selectedStation);

  return (
    <RetroWindow title="Station info">
      {isLoading && !meta ? (
        <p className={styles.muted}>Loading station data…</p>
      ) : (
        <>
          <h2 className={styles.name}>{meta?.name ?? selectedStation}</h2>
          <p className={styles.abbr}>{selectedStation}</p>
          {meta && (
            <address className={styles.address}>
              {meta.address}
              <br />
              {meta.city}, {meta.state} {meta.zipcode}
            </address>
          )}
          <PixelDivider />
          <p className={styles.linesLabel}>Lines</p>
          <ul className={styles.lineList}>
            {lines.map((line) => (
              <li key={line.color} className={styles.lineChip} style={{ borderColor: line.hexcolor }}>
                <span className={styles.lineSwatch} style={{ backgroundColor: line.hexcolor }} />
                {line.name}
              </li>
            ))}
          </ul>
          <Link to={`/station/${selectedStation}`} className={styles.detailLink}>
            Open full station view →
          </Link>
        </>
      )}
    </RetroWindow>
  );
}
