import { motion } from 'framer-motion';
import styles from './Map.module.css';

interface TrainBlipProps {
  x: number;
  y: number;
  color: string;
}

export function TrainBlip({ x, y, color }: TrainBlipProps) {
  return (
    <motion.g
      className={styles.trainBlip}
      initial={false}
      animate={{ x, y }}
      transition={{ type: 'tween', duration: 1.5, ease: 'easeInOut' }}
    >
      <circle r={5} fill={color} opacity={0.35} className="animate-pulse" />
      <circle r={3} fill={color} />
    </motion.g>
  );
}
