import React from 'react';
import { mount } from 'enzyme';
import usePrevious from '../usePrevious';

interface PreviousProps {
  value?: string;
}
const Previous: React.FC<PreviousProps> = ({ value }) => {
  const previousValue = usePrevious(value);
  return <div>{previousValue}</div>;
};

describe('usePrevious', () => {
  it('should render', () => {
    const wrapper = mount(<Previous />);
    expect(wrapper.exists()).toBeTruthy();
    wrapper.unmount();
  });

  it('should set init value', () => {
    const VALUE = 'value';
    const wrapper = mount(<Previous value={VALUE} />);
    const value = wrapper.text();
    expect(value).toEqual(VALUE);
    wrapper.unmount();
  });

  it('stores the previous value of given variable', () => {
    const VALUE_1 = 'hello';
    const VALUE_2 = 'world';
    const VALUE_3 = 'okay';
    let value = VALUE_1;
    const wrapper = mount(<Previous value={value} />);

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

    wrapper.unmount();
  });
});
