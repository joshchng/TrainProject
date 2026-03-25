import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './RetroButton.module.css';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
  variant?: 'default' | 'small' | 'back';
}

export function RetroButton({
  children,
  active = false,
  variant = 'default',
  className = '',
  ...props
}: RetroButtonProps) {
  return (
    <button
      className={`${styles.button} ${active ? styles.active : ''} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
