import React, { Fragment, createElement } from 'react';
import { shallow } from 'enzyme';

import renderPage from '../renderPage';

const testNullRender = (data: any) => {
  expect(renderPage(data)).toEqual(null);
};

const testFragmentRender = (data: any) => {
  const page = renderPage(data) as React.ReactElement;
  const Element = ({ data }: Record<string, any>) => <Fragment>{data}</Fragment>;
  const testPage = shallow(<Element data={data} />);
  expect(testPage.equals(page)).toEqual(true);
};

const Component = ({ text }: Record<string, any>) => <div className="okay">{text}</div>;
Component.defaultProps = {
  text: 'ok',
};

describe('renderPage', () => {
  it('renders null', () => {
    testNullRender(null);
  });

  it('renders string as fragment', () => {
    testFragmentRender('sample text');
  });

  it('renders empty string as null', () => {
    testNullRender('');
  });

  it('renders boolean as null', () => {
    testFragmentRender(true);
  });

  it('renders false boolean as null', () => {
    testNullRender(false);
  });

  it('renders number as fragment', () => {
    testFragmentRender(42);
  });

  it('renders negative number as fragment', () => {
    testFragmentRender(-42);
  });

  it('renders 0 number as fragment', () => {
    testNullRender(0);
  });

  it('renders component without props', () => {
    const page = renderPage(Component) as React.ReactElement;
    const testPage = createElement(Component);
    expect(shallow(page).text()).toEqual(Component.defaultProps.text);
    expect(testPage).toEqual(page);
  });

  it('renders component with props', () => {
    const text = 'Hello world';
    const page = renderPage(Component, { text }) as React.ReactElement;
    const testPage = createElement(Component, { text });
    expect(shallow(page).text()).toEqual(text);
    expect(testPage).toEqual(page);
  });
});
