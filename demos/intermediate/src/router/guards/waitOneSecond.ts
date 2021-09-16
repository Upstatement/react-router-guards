import { GuardFunction } from 'react-router-guards';

const waitOneSecond: GuardFunction = async (ctx, next) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return next();
};

export default waitOneSecond;
