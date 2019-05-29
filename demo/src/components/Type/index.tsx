import React, { useMemo } from 'react';
import { className, getName } from 'utils';
import styles from './type.module.scss';

interface Props {
  type: string;
}

const Type: React.FunctionComponent<Props> = ({ type }) => {
  const text = useMemo(() => getName(type), [type]);

  return <div {...className(styles.type, styles[`type--${type}`])}>{text}</div>;
};

export default Type;
