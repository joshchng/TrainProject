import type { ReactNode } from 'react';
import styles from './RetroWindow.module.css';

interface RetroWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function RetroWindow({ title, children, className = '' }: RetroWindowProps) {
  return (
    <div className={`${styles.window} ${className}`}>
      <div className={styles.titlebar}>
        <span className={styles.titleText}>{title}</span>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
