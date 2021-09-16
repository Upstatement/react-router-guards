import React, { createElement, Fragment } from 'react';
import { PageComponent } from './types';

type BaseProps = Record<string, any>;

/**
 * Renders a page with the given props.
 *
 * @param page the page component to render
 * @param props the props to pass to the page
 * @returns the page component
 */
export function renderPage<Props extends BaseProps>(
  page: PageComponent,
  props?: Props,
): React.ReactElement | null {
  if (!page) {
    return null;
  } else if (typeof page !== 'string' && typeof page !== 'boolean' && typeof page !== 'number') {
    return createElement(page, props || {});
  }
  return <Fragment>{page}</Fragment>;
}
