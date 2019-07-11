import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import useStateWhenMounted, { SetState } from '../useStateWhenMounted';

interface UseStateWhenMountedHookProps {
  value?: string;
}
const UseStateWhenMountedHook: React.FC<UseStateWhenMountedHookProps> = ({ value }) => {
  const stateRef = useStateWhenMounted(value);
  return <div data-state-ref={stateRef} />;
};

function getState<T>(wrapper: ReactWrapper): [T, SetState<T>] {
  return wrapper.find('div').prop('data-state-ref');
}

describe('usePrevious', () => {
  const INIT_VALUE = 'value';
  let wrapper: ReactWrapper | null = null;

  afterEach(() => {
    if (wrapper && wrapper.exists()) {
      wrapper.unmount();
    }
    wrapper = null;
  });

  it('should render', () => {
    wrapper = mount(<UseStateWhenMountedHook />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should set initial state to undefined with no passed value', () => {
    wrapper = mount(<UseStateWhenMountedHook />);
    const [state] = getState<string>(wrapper);
    expect(state).toEqual(undefined);
  });

  it('should set initial state to passed value', () => {
    wrapper = mount(<UseStateWhenMountedHook value={INIT_VALUE} />);
    const [state] = getState<string>(wrapper);
    expect(state).toEqual(INIT_VALUE);
  });

  it('should prevent value update when component is unmounted', () => {
    const VALUE = 'value';
    wrapper = mount(<UseStateWhenMountedHook value={INIT_VALUE} />);
    const [state, setState] = getState<string>(wrapper);
    expect(state).toEqual(VALUE);

    wrapper.unmount();

    const NEW_VALUE = 'new value';
    act(() => {
      setState(NEW_VALUE);
    });
    expect(state).toEqual(VALUE);
  });
});
