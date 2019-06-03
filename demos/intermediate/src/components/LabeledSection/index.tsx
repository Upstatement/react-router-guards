import React from 'react';
import { className } from 'utils';
import styles from './labeledSection.module.scss';

interface Props {
  className?: string;
  label: string;
  large?: boolean;
}

const LabeledSection: React.FunctionComponent<Props> = ({
  children,
  className: customClassName,
  label,
  large,
}) => (
  <section {...className(styles.section, customClassName)}>
    {large ? (
      <h3 className={styles.labelLarge}>{label}</h3>
    ) : (
      <p className={styles.label}>{label}</p>
    )}
    {children}
  </section>
);

LabeledSection.defaultProps = {
  large: false,
};

export default LabeledSection;
