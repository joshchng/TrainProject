import styles from './PixelDivider.module.css';

interface PixelDividerProps {
  className?: string;
}

export function PixelDivider({ className = '' }: PixelDividerProps) {
  return <hr className={`${styles.divider} ${className}`} />;
}
