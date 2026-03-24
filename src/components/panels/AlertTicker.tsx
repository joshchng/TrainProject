import { useState } from 'react';
import { useAdvisories } from '@/api/hooks';
import styles from './AlertTicker.module.css';

function hasDelayOrAlert(text: string, type: string): boolean {
  const t = `${type} ${text}`.toLowerCase();
  return t.includes('delay') || t.includes('disruption') || t.includes('elevator') || t.includes('advisory');
}

export function AlertTicker() {
  const { data: advisories, isLoading, isError } = useAdvisories();
  const [expanded, setExpanded] = useState(false);

  const items = advisories?.filter((a) => a.description.trim()) ?? [];
  const text =
    items.length > 0
      ? items.map((a) => a.description.replace(/\s+/g, ' ').trim()).join('   •   ')
      : isLoading
        ? 'Loading service advisories…'
        : isError
          ? 'Unable to load advisories. Is the API proxy running?'
          : 'No active service advisories.';

  const urgent = items.some((a) => hasDelayOrAlert(a.description, a.type));

  return (
    <button
      type="button"
      className={`${styles.bar} ${urgent ? styles.urgent : ''} ${expanded ? styles.expanded : ''}`}
      onClick={() => setExpanded((e) => !e)}
      aria-expanded={expanded}
    >
      <span className={styles.icon} aria-hidden>
        ⚡
      </span>
      <span className={styles.label}>Advisory</span>
      <div className={styles.track}>
        <div className={styles.marquee}>
          <span>{text}</span>
          <span aria-hidden>{text}</span>
        </div>
      </div>
      {expanded && (
        <div className={styles.expandPanel}>
          {items.length === 0 ? (
            <p className={styles.expandText}>{text}</p>
          ) : (
            <ul className={styles.list}>
              {items.map((a) => (
                <li key={`${a.id}-${a.posted}`} className={styles.listItem}>
                  <span className={styles.listType}>{a.type || 'Notice'}</span>
                  {a.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </button>
  );
}
