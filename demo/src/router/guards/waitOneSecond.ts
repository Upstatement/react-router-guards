import { GuardFunction } from 'react-router-guards';

const waitOneSecond: GuardFunction = async (to, from, next) => {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  next.props({
    hello: 'world',
  });
};

export default waitOneSecond;
