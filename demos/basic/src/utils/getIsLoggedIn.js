import { STORAGE_KEYS } from 'utils/constants';

const getIsLoggedIn = () => localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';

export default getIsLoggedIn;
