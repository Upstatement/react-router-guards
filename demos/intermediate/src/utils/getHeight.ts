import { Height } from 'types';

const METERS_TO_FEET = 3.28084;

/**
 * Serializes the given height into a few different measurements
 * and formats.
 *
 * @param height the height in decimeters
 */
const getHeight = (height: number): Height => {
  const meters = height / 10;

  const feetFloat = meters * METERS_TO_FEET;
  const feet = Math.floor(feetFloat);
  const inches = Math.round((feetFloat - feet) * 12);

  const feetStr = feet ? `${feet}'` : '';
  const inchesStr = inches ? `${inches.toString().padStart(2, '0')}"` : '';

  return {
    meters,
    feet,
    inches,
    metric: `${meters}m`,
    imperial: `${feetStr}${inchesStr}`,
  };
};

export default getHeight;
