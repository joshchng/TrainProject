import { PixelDivider } from '@/components/chrome/PixelDivider';
import styles from './About.module.css';

export function About() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>About BART Tracker</h1>
      <p className={styles.lead}>
        A retro-styled, real-time view of the Bay Area Rapid Transit system. Data comes from the public{' '}
        <a href="https://api.bart.gov/docs/overview/index.aspx" target="_blank" rel="noreferrer">
          BART API
        </a>
        . This is an unofficial fan project.
      </p>

      <div className={styles.construction} role="img" aria-label="Under construction">
        <span className={styles.stripes} />
        <span className={styles.banner}>UNDER CONSTRUCTION</span>
        <span className={styles.stripes} />
      </div>

      <PixelDivider />

      <section className={styles.section}>
        <h2 className={styles.h2}>Guestbook</h2>
        <ul className={styles.guestbook}>
          <li>
            <span className={styles.gbName}>TrainFan_94</span>
            <span className={styles.gbMsg}>Nice flip board!!</span>
          </li>
          <li>
            <span className={styles.gbName}>OaklandRider</span>
            <span className={styles.gbMsg}>Bring back the carpet aesthetic.</span>
          </li>
          <li>
            <span className={styles.gbName}>Webmaster</span>
            <span className={styles.gbMsg}>Thanks for visiting — signings are static for now.</span>
          </li>
        </ul>
      </section>

      <PixelDivider />

      <footer className={styles.footer}>
        <p>Built with React, Vite, TanStack Query, Zustand, and Framer Motion.</p>
        <p>Not affiliated with BART.</p>
      </footer>
    </div>
  );
}
