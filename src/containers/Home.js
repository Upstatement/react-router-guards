import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { increaseCount } from 'actions/base';

const Home = ({ count, increaseCount }) => (
  <div>
    <h1>Home</h1>
    <p>{count}</p>
    <button onClick={increaseCount}>Add one</button>
  </div>
);

Home.propTypes = {
  count: PropTypes.number.isRequired,
  increaseCount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  count: state.base.count,
});

export default connect(
  mapStateToProps,
  { increaseCount },
)(Home);
