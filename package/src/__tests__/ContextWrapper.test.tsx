import React, { useContext } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import ContextWrapper from '../ContextWrapper';
import { ErrorPageContext, LoadingPageContext } from '../contexts';

interface ContextConsumerProps<T> {
  context: React.Context<T>;
}
function ContextConsumer<T>({ context }: React.PropsWithChildren<ContextConsumerProps<T>>) {
  const value = useContext(context);
  return <div data-value={value} />;
}

function getCtxValue<T>(wrapper: ReactWrapper): T {
  return wrapper.find('div').prop('data-value');
}

describe('ContextWrapper', () => {
  let wrapper: ReactWrapper | null = null;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    wrapper = null;
  });

  it('should render', () => {
    wrapper = mount(<ContextWrapper context={ErrorPageContext} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should render children', () => {
    wrapper = mount(
      <ContextWrapper context={ErrorPageContext}>
        <div />
      </ContextWrapper>,
    );
    expect(wrapper.find('div').exists()).toBeTruthy();
  });

  it('should render a context provider if a value is provided', () => {
    const VALUE = 'hello';
    wrapper = mount(
      <ContextWrapper context={ErrorPageContext} value={VALUE}>
        <ContextConsumer context={ErrorPageContext} />
      </ContextWrapper>,
    );
    expect(getCtxValue(wrapper)).toEqual(VALUE);
  });

  it('should render a fragment if no value is provided', () => {
    wrapper = mount(
      <ContextWrapper context={ErrorPageContext}>
        <ContextConsumer context={ErrorPageContext} />
      </ContextWrapper>,
    );
    expect(getCtxValue(wrapper)).toEqual(null);
  });

  it('should only provide the value of the innermost context wrapper', () => {
    const OUTER_VALUE = 'hello';
    const INNER_VALUE = 'world';
    wrapper = mount(
      <ContextWrapper context={ErrorPageContext} value={OUTER_VALUE}>
        <ContextWrapper context={ErrorPageContext} value={INNER_VALUE}>
          <ContextConsumer context={ErrorPageContext} />
        </ContextWrapper>
      </ContextWrapper>,
    );
    expect(getCtxValue(wrapper)).toEqual(INNER_VALUE);
  });

  it(`should not override a parent context wrapper's value if different context types are provided`, () => {
    const ERROR_VALUE = 'hello';
    const LOADING_VALUE = 'world';
    wrapper = mount(
      <ContextWrapper context={ErrorPageContext} value={ERROR_VALUE}>
        <ContextWrapper context={LoadingPageContext} value={LOADING_VALUE}>
          <ContextConsumer context={ErrorPageContext} />
        </ContextWrapper>
      </ContextWrapper>,
    );
    expect(getCtxValue(wrapper)).toEqual(ERROR_VALUE);
  });
});
