export default (...classes) => ({
  className: classes.filter(className => typeof className === 'string').join(' '),
});
