import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  className?: string;
  newTab?: boolean;
  to: string;
}

const Link: React.FunctionComponent<Props> = ({ children, className, newTab, to }) => {
  const isInternal = /^\/(?!\/)/.test(to);
  const isFile = /\.[0-9a-z]+$/i.test(to);
  const isInternalLink = isInternal && !isFile;

  if (isInternalLink) {
    return (
      <RouterLink className={className} to={to}>
        {children}
      </RouterLink>
    );
  }

  let props: Record<string, any> = {
    className,
    href: to,
  };

  if (newTab) {
    props = Object.assign(props, {
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  }

  return <a {...props}>{children}</a>;
};

Link.defaultProps = {
  className: '',
  newTab: false,
};

export default Link;
