import { Link } from 'react-router-dom';
import styles from './RetroHeader.module.css';

export function RetroHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <div className={styles.logo}>
          <span className={styles.logoMark} aria-hidden />
          <span className={styles.logoText}>BART Tracker</span>
        </div>
      </Link>
      <nav className={styles.nav}>
        <Link to="/map" className={styles.navLink}>
          Map
        </Link>
      </nav>
    </header>
  );
}
