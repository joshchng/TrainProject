import type { ReactNode } from 'react';
import styles from './RetroWindow.module.css';

interface RetroWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  /** Applied to the body below the titlebar (e.g. flex + overflow for scrollable panels). */
  contentClassName?: string;
  /** Tighter chrome for tool strips and dense side columns. */
  compact?: boolean;
}

export function RetroWindow({
  title,
  children,
  className = '',
  contentClassName = '',
  compact = false,
}: RetroWindowProps) {
  return (
    <div className={`${styles.window} ${compact ? styles.windowCompact : ''} ${className}`}>
      <div className={styles.titlebar}>
        <span className={styles.titleText}>{title}</span>
      </div>
      <div className={`${styles.content} ${contentClassName}`}>{children}</div>
    </div>
  );
}
