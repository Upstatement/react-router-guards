import React from 'react';
import { className } from 'utils';
import styles from './pokeball.module.scss';

interface Props {
  isAnimated?: boolean;
}

const Pokeball: React.FunctionComponent<Props> = ({ isAnimated }) => (
  <div {...className(styles.wrapper, isAnimated && styles['wrapper--animated'])}>
    <svg
      viewBox="0 0 134 134"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xlinkHref="http://www.w3.org/1999/xlink">
      <path
        className={styles.top}
        d="M131,67 C131,31.653776 102.346224,3 67,3 C31.653776,3 3,31.653776 3,67 C3,67 131,67 131,67 Z"
      />
      <path
        className={styles.bottom}
        d="M131,131 C131,95.653776 102.346224,67 67,67 C31.653776,67 3,95.653776 3,131 C3,131 131,131 131,131 Z"
        transform="translate(67.000000, 99.000000) scale(1, -1) translate(-67.000000, -99.000000) "
      />
      <polygon className={styles.outline} fillRule="nonzero" points="50 64 50 70 0 70 0 64" />
      <polygon className={styles.outline} fillRule="nonzero" points="134 64 134 70 84 70 84 64" />
      <path
        className={styles.outline}
        d="M67,134 C29.9969218,134 0,104.003078 0,67 C0,29.9969218 29.9969218,0 67,0 C104.003078,0 134,29.9969218 134,67 C134,104.003078 104.003078,134 67,134 Z M67,128 C100.68937,128 128,100.68937 128,67 C128,33.3106303 100.68937,6 67,6 C33.3106303,6 6,33.3106303 6,67 C6,100.68937 33.3106303,128 67,128 Z"
        fillRule="nonzero"
      />
      <circle
        {...className(styles.button, isAnimated && styles['button--animated'])}
        cx="67"
        cy="67"
        r="20"
      />
      <path
        className={styles.outline}
        d="M67,90 C54.2974508,90 44,79.7025492 44,67 C44,54.2974508 54.2974508,44 67,44 C79.7025492,44 90,54.2974508 90,67 C90,79.7025492 79.7025492,90 67,90 Z M67,84 C76.3888407,84 84,76.3888407 84,67 C84,57.6111593 76.3888407,50 67,50 C57.6111593,50 50,57.6111593 50,67 C50,76.3888407 57.6111593,84 67,84 Z"
        fillRule="nonzero"
      />
    </svg>
  </div>
);

Pokeball.defaultProps = {
  isAnimated: false,
};

export default Pokeball;
