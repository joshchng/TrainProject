import { Link } from 'react-router-dom';
import { BartMonogram } from '@/components/chrome/BartMonogram';
import { PixelDivider } from '@/components/chrome/PixelDivider';
import styles from './About.module.css';

export function About() {
  return (
    <div className={styles.page}>
      <div className={styles.bartMarkWrap}>
        <BartMonogram className={styles.bartMark} />
      </div>
      <header className={styles.hero}>
        <h1 className={styles.title}>BART Tracker</h1>
        <p className={styles.lead}>
          Retro dashboard for live BART data
        </p>
        <p className={styles.lead}>
          [INDEPENDENT PROJECT] not affiliated with BART
        </p>
      </header>

      <div className={styles.ctaRow}>
        <Link to="/map" className={styles.cta}>
          Open live map →
        </Link>
      </div>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-motivation">
        <h2 id="about-motivation" className={styles.h2}>
          Motivation
        </h2>
        <p className={styles.p}>
          This is a passion project I've been wanting to build for a while. I love riding BART, and I wanted it to feel
          like you're in a train controller's seat watching the status of every train in the system.
        </p>
      </section>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-features">
        <h2 id="about-features" className={styles.h2}>
          Features
        </h2>
        <ul className={styles.featureList}>
          <li>
            <strong>Map</strong> — stations, trains, line/direction filters, and side panels for the selected stop.
          </li>
          <li>
            <strong>Alerts</strong> — ticker on the map for advisories and service changes.
          </li>
          <li>
            <strong>Station pages</strong> — departures and elevator/escalator status (deep links from the map).
          </li>
        </ul>
      </section>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-data">
        <h2 id="about-data" className={styles.h2}>
          Data
        </h2>
        <p className={styles.p}>
          Everything here comes from BART's public{' '}
          <a href="https://api.bart.gov/docs/overview/index.aspx" target="_blank" rel="noreferrer">
            API
          </a>
          . Schedules, train positions, advisories. This site just reads it.
        </p>
        <p className={styles.p}>
          The tracking system started as military hardware. Hughes Aircraft built it for the U.S. Army. BART adapted it.
          Transmitters ride the trains. Receivers line the track. The system measures the travel time of radio waves
          between them and works out where each train is.
        </p>
        <p className={styles.p}>
          That data lands in the Operations Control Center, a dark room underneath Lake Merritt station. Seven monitors
          per desk. Wall-sized maps. Color-coded trains crawling across the whole system. Controllers watch it all.
        </p>
        <p className={styles.p}>
          The current system only knows which broad section of track a train occupies. Not the exact spot. BART is
          spending $798 million to change that—4,500 new transponders, 1,100 radio antennas, true position tracking. When
          it's done, the Transbay Tube goes from 24 trains per hour to 30.
        </p>
        <p className={styles.p}>
          Most of the time the data matches what you see on the platform. Sometimes it doesn't. Disruptions, GPS
          drift, API hiccups. If something looks off, check{' '}
          <a href="https://www.bart.gov/" target="_blank" rel="noreferrer">
            bart.gov
          </a>{' '}
          or the signs at the station.
        </p>
      </section>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-privacy">
        <h2 id="about-privacy" className={styles.h2}>
          Privacy
        </h2>
        <p className={styles.p}>
          There's no login and no ad trackers baked into this project.
        </p>
        <p className={styles.p}>
          Your phone carrier, your Wi-Fi, and whoever's hosting the site can still see that you loaded a page—that's
          normal for any website, and this one doesn't pretend to be a privacy shield. The goal is simply not to layer
          extra data collection on you beyond what fetching train times already implies.
        </p>
      </section>

      <PixelDivider />

      <section className={styles.section} aria-labelledby="about-stack">
        <h2 id="about-stack" className={styles.h2}>
          Stack
        </h2>
        <dl className={styles.defList}>
          <div>
            <dt>UI</dt>
            <dd>React, Vite, CSS modules, Framer Motion</dd>
          </div>
          <div>
            <dt>Data</dt>
            <dd>TanStack Query, BART API</dd>
          </div>
          <div>
            <dt>State</dt>
            <dd>Zustand (map + selection)</dd>
          </div>
        </dl>
      </section>

      <PixelDivider />

      <footer className={styles.footer}>
        <p>
          <strong>Disclaimer:</strong> BART names and marks belong to Bay Area Rapid Transit. Unofficial hobby project;
          as-is, no warranty.
        </p>
      </footer>
    </div>
  );
}
