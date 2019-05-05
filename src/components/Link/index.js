import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const Link = ({ children, newTab, to, ...props }) => {
  const isInternal = /^\/(?!\/)/.test(to);
  const isFile = /\.[0-9a-z]+$/i.test(to);
  const useInternalLink = isInternal && !isFile;

  const Component = useInternalLink ? RouterLink : 'a';
  props[useInternalLink ? 'to' : 'href'] = to;

  if (newTab && !useInternalLink) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }

  return <Component {...props}>{children}</Component>;
};

Link.defaultProps = {
  newTab: false,
};

Link.propTypes = {
  children: PropTypes.node,
  newTab: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

export default Link;
