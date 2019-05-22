import { GuardFunction } from 'react-router-guards';

const waitOneSecond: GuardFunction = async (to, from, next) => {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  next();
};

export default waitOneSecond;
