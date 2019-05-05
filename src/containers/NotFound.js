import React from 'react';

const NotFound = props =>
  console.log(props) || (
    <div>
      <h1>Page not found</h1>
      <p>Look for something else</p>
    </div>
  );

export default NotFound;
