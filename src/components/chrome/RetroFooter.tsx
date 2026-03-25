import { useTrainsInServiceDisplay } from '@/api/hooks';
import { formatLastUpdated } from '@/utils/time';
import { useState, useEffect } from 'react';
import styles from './RetroFooter.module.css';

export function RetroFooter() {
  const trains = useTrainsInServiceDisplay();
  const [hitCount, setHitCount] = useState(4732);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setHitCount((c) => c + Math.floor(Math.random() * 3));
      setLastUpdated(new Date());
    }, 15_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.section}>
        <span className={styles.label}>Trains:</span>
        <span className={styles.value}>{trains}</span>
      </div>
      <div className={styles.section}>
        <span className={styles.counter}>
          [{String(hitCount).padStart(9, '0')}] visitors
        </span>
      </div>
      <div className={styles.section}>
        <span className={styles.label}>Updated:</span>
        <span className={styles.value}>{formatLastUpdated(lastUpdated)}</span>
      </div>
      <div className={styles.section}>
        <span className={styles.label}>Connection:</span>
        <span className={`${styles.liveDot} animate-blink`}>●</span>
        <span className={styles.liveText}>LIVE</span>
      </div>
    </footer>
  );
}
