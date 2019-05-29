const className = (...classes: any[]) => ({
  className: classes.filter(className => typeof className === 'string').join(' '),
});

export default className;
