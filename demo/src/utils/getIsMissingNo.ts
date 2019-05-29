import { MISSINGNO } from 'utils/constants';

const getIsMissingNo = (id: number) => id > 0 && id % MISSINGNO.ID === 0;

export default getIsMissingNo;
