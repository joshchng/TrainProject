import { Link } from 'react-router-dom';
import { PixelDivider } from '@/components/chrome/PixelDivider';
import styles from './About.module.css';

export function About() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>BART Tracker</h1>
      <p className={styles.lead}>
        A retro-styled dashboard for following Bay Area Rapid Transit in near real time: system map, departure
        estimates, service alerts, and per-station detail. This site is an independent project and is not affiliated
        with BART.
      </p>

      <div className={styles.ctaRow}>
        <Link to="/map" className={styles.cta}>
          Open live map →
        </Link>
      </div>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-features">
        <h2 id="about-features" className={styles.h2}>
          What you can do here
        </h2>
        <ul className={styles.featureList}>
          <li>
            <strong>Explore the map</strong> — see stations and trains, filter by line or direction, and select a stop
            to load its departures and details in the side panels.
          </li>
          <li>
            <strong>Read the alert ticker</strong> — advisories and service changes from BART roll across the top on the
            map view so you can spot delays without digging through a separate feed.
          </li>
          <li>
            <strong>Open a station page</strong> — each stop has a focused view with departure boards and elevator /
            escalator status when you follow a deep link from the map.
          </li>
        </ul>
      </section>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-data">
        <h2 id="about-data" className={styles.h2}>
          Data source and accuracy
        </h2>
        <p className={styles.p}>
          Schedules and vehicle positions come from the public{' '}
          <a href="https://api.bart.gov/docs/overview/index.aspx" target="_blank" rel="noreferrer">
            BART API
          </a>
          . ETAs and train counts can drift during disruptions, GPS quirks, or API maintenance; treat everything as a
          best-effort snapshot, not a guarantee of service.
        </p>
        <p className={styles.p}>
          If something looks wrong, cross-check{' '}
          <a href="https://www.bart.gov/" target="_blank" rel="noreferrer">
            bart.gov
          </a>{' '}
          or platform signage — this app only reflects what the API reports at refresh time.
        </p>
      </section>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-privacy">
        <h2 id="about-privacy" className={styles.h2}>
          Privacy
        </h2>
        <p className={styles.p}>
          There are no accounts and no deliberate tracking layer in this codebase: your browser talks to the same BART
          data endpoints the map needs. Network operators and hosting providers may still see routine traffic as with
          any website.
        </p>
      </section>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-stack">
        <h2 id="about-stack" className={styles.h2}>
          Built with
        </h2>
        <dl className={styles.defList}>
          <div>
            <dt>UI</dt>
            <dd>React, Vite, CSS modules, Framer Motion</dd>
          </div>
          <div>
            <dt>Data layer</dt>
            <dd>TanStack Query, BART API (via the app’s HTTP client)</dd>
          </div>
          <div>
            <dt>Client state</dt>
            <dd>Zustand (selected station and UI-related map state)</dd>
          </div>
        </dl>
      </section>

      <PixelDivider />

      <footer className={styles.footer}>
        <p>
          <strong>Disclaimer:</strong> “BART,” station names, and related marks belong to Bay Area Rapid Transit. This
          project is unofficial fan / educational software offered as-is, without warranty.
        </p>
      </footer>
    </div>
  );
}
