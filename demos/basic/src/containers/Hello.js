import React from 'react';
import PropTypes from 'prop-types';

const Hello = ({ match }) => {
  console.log(match.params.id);
  return (
    <div>
      <h1>Hello there!</h1>
      <p>
        This is a page with the id <strong>{match.params.id}</strong>
      </p>
    </div>
  );
};

Hello.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default Hello;
