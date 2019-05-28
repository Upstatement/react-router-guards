import React, { useMemo, useState, useEffect } from 'react';
import getColorFromImg from 'rgbaster';
import tinycolor from 'tinycolor2';
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
  const hasSprites = useMemo(() => Object.values(sprites).some(sprite => sprite), [sprites]);

  const getColor = async () => {
    if (sprites.front_default) {
      const colorOptions = await getColorFromImg(sprites.front_default);
      let index = 0;
      let rgb = [255, 255, 255];
      while (index < colorOptions.length - 1) {
        const [r, g, b] = colorOptions[index].color
          .replace(/(rgb\(|\))+/g, '')
          .split(',')
          .map((v: string) => parseInt(v) || 0);
        index += 1;
        if (!(r === 0 && g === 0 && b === 0) && !(r === 255 && g === 255 && b === 255)) {
          rgb = [r, g, b];
          break;
        }
      }
      const rgba = tinycolor(`rgba(${rgb.join(',')}, 0.1)`);
      const luminance = Math.round(rgba.getLuminance() * 100);
      if (luminance >= 80) {
        rgba.darken(100 - luminance || 20);
      }
      setColor(rgba.toRgbString());
    }
  };

  useEffect(() => {
    getColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprites]);

  if (!hasSprites) {
    return null;
  }

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
