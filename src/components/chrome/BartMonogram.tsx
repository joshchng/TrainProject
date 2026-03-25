import type { SVGProps } from 'react';
import styles from './BartMonogram.module.css';

/** Interlocking “ba” mark paths from the official BART site logo (decorative; BART is a third‑party mark). */
const D_B =
  'M38.131,26.825c-7.659,0-9.813,1.915-10.891,2.513c0-2.393,0-14.601,0-14.601H15.272v42.248h11.608v-2.036c3.95,2.274,8.378,2.632,11.25,2.632c4.429,0,18.67-1.914,18.67-15.078C56.802,31.852,47.706,26.825,38.131,26.825z M38.184,50.726c-4.675,0-8.463-3.787-8.463-8.461c0-4.676,3.788-8.465,8.463-8.465c4.674,0,8.463,3.789,8.463,8.465C46.647,46.939,42.858,50.726,38.184,50.726z';

const D_A =
  'M74.332,27.302c0,0,0,1.196,0,1.792c-2.5-1.438-5.694-2.163-9.521-2.15h-0.179c-2.016-0.005-8.597,0.291-13.172,4.059c3.236,2.587,5.344,6.391,5.344,11.5c0,5.337-2.356,8.805-5.437,11.067c0.975,0.922,2.094,1.719,3.365,2.376c3.896,2.019,8.176,2.234,9.831,2.234c2.74,0,4.957-0.192,9.77-2.612c0,0.526,0,1.655,0,1.655h12.152V27.302H74.332z M65.671,50.726c-4.651,0-8.425-3.787-8.425-8.461c0-4.676,3.772-8.465,8.425-8.465c4.653,0,8.425,3.789,8.425,8.465C74.096,46.939,70.324,50.726,65.671,50.726z';

type Props = Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'xmlns'>;

export function BartMonogram({ className, ...rest }: Props) {
  return (
    <svg
      className={[styles.svg, className].filter(Boolean).join(' ')}
      viewBox="12.5 11.5 76 58"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      {...rest}
    >
      <path className={styles.letterB} d={D_B} fillRule="evenodd" />
      <path className={styles.letterA} d={D_A} fillRule="evenodd" />
    </svg>
  );
}
