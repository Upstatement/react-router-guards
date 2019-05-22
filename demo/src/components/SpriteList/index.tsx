import React, { useMemo, useState, useEffect } from 'react';
import getColorFromImg from 'rgbaster';
import { Sprite } from 'components';
import { PokemonSprites } from 'types';
import styles from './spriteList.module.scss';

interface Props {
  sprites: PokemonSprites;
}

const SpriteList: React.FunctionComponent<Props> = ({ sprites }) => {
  const [color, setColor] = useState('#ffffff');
  const sources = useMemo(
    () => [
      {
        src: sprites.front_default,
        label: 'Front',
      },
      {
        src: sprites.back_default,
        label: 'Back',
      },
      {
        src: sprites.front_shiny,
        label: 'Front (Shiny)',
      },
      {
        src: sprites.back_shiny,
        label: 'Back (Shiny)',
      },
    ],
    [sprites],
  );

  const getColor = async () => {
    if (sprites.front_default) {
      const color = await getColorFromImg(sprites.front_default);
      const rgb = color[0].color.replace(/(rgb\(|\))+/g, '');
      setColor(`rgba(${rgb}, 0.1)`);
    }
  };

  useEffect(() => {
    getColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprites]);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {sources.map(
          ({ label, src }, i) =>
            src && (
              <li key={i} className={styles.item}>
                <Sprite src={src} label={label} color={color} />
              </li>
            ),
        )}
      </ul>
    </div>
  );
};

export default SpriteList;
