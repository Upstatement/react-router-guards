import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import usePrevious from '../usePrevious';

interface UsePreviousHookProps {
  value?: string;
}
const UsePreviousHook: React.FC<UsePreviousHookProps> = ({ value }) => {
  const previousValue = usePrevious(value);
  return <div>{previousValue}</div>;
};

describe('usePrevious', () => {
  let wrapper: ReactWrapper | null = null;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    wrapper = null;
  });

  it('should render', () => {
    wrapper = mount(<UsePreviousHook />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should set init value', () => {
    const VALUE = 'value';
    wrapper = mount(<UsePreviousHook value={VALUE} />);
    expect(wrapper.text()).toEqual(VALUE);
  });

  it('stores the previous value of given variable', () => {
    const VALUE_1 = 'hello';
    const VALUE_2 = 'world';
    const VALUE_3 = 'okay';

    let value = VALUE_1;
    wrapper = mount(<UsePreviousHook value={value} />);

    let hookValue = wrapper.text();
    expect(hookValue).toEqual(value);
    expect(hookValue).toEqual(VALUE_1);

    value = VALUE_2;
    wrapper.setProps({ value });
    hookValue = wrapper.text();
    expect(hookValue).toEqual(VALUE_1);

    value = VALUE_3;
    wrapper.setProps({ value });
    hookValue = wrapper.text();
    expect(hookValue).toEqual(VALUE_2);
  });
});
