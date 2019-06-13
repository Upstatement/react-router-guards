import React, { useState, useEffect, useMemo } from 'react';

const Home = ({ history }) => {
  const [isHashUrl, setIsHashUrl] = useState(true);
  const [value, setValue] = useState('');

  const urlType = useMemo(() => (isHashUrl ? 'hash' : 'query'), [isHashUrl]);

  const updateVal = ({ target }) => {
    setValue(target.value);
  };

  const toggleUrlType = () => setIsHashUrl(value => !value);

  useEffect(() => {
    let url = `#${value}`;
    if (!isHashUrl) {
      url = `?value=${value}`;
    }
    history.replace(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHashUrl, value]);

  return (
    <div>
      <h1>Home</h1>
      <h3>Update {urlType} URL</h3>
      <input value={value} onChange={updateVal} />
      <button onClick={toggleUrlType}>Toggle URL type</button>
    </div>
  );
};

export default Home;
