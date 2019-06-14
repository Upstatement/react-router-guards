import { Weight } from 'types';

const KG_TO_POUND = 2.20462;

/**
 * Serializes the given weight into a few different measurements
 * and formats.
 *
 * @param weight the weight in hectograms
 */
const getWeight = (weight: number): Weight => {
  const kilograms = weight / 10;
  const pounds = kilograms * KG_TO_POUND;
  const poundsStr = Math.round(pounds * 10) / 10;

  return {
    kilograms,
    pounds,
    metric: `${kilograms}kg`,
    imperial: `${poundsStr}lb`,
  };
};

export default getWeight;
