import { GuardFunction } from '@upstatement/react-router-guards';

const waitOneSecond: GuardFunction = async (to, from, next) => {
  setTimeout(next, 1000);
};

export default waitOneSecond;
