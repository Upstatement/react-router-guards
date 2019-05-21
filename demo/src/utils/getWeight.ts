const KG_TO_POUND = 2.20462;

/**
 *
 * @param height the height in hectograms
 */
const getWeight = (weight: number) => {
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
