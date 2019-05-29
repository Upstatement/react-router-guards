import { Slotted } from 'types';

function sortSlots<T extends Slotted>(list: T[]) {
  return list.sort((a, b) => a.slot - b.slot);
}

export default sortSlots;
