const waitOneSecond = async (to, from, next) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  next.props({
    hello: 'world',
  });
};

export default waitOneSecond;
