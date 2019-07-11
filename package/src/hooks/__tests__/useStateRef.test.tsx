import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import useStateRef, { State, SetState } from '../useStateRef';

interface UseStateRefHookProps {
  value?: string;
}
const UseStateRefHook: React.FC<UseStateRefHookProps> = ({ value }) => {
  const stateRef = useStateRef(value);
  return <div data-state-ref={stateRef} />;
};

function getState<T>(wrapper: ReactWrapper): [State<T>, SetState<T>] {
  const div = wrapper.find('div');
  return div.prop('data-state-ref');
}

describe('usePrevious', () => {
  const INIT_VALUE = 'value';
  let wrapper: ReactWrapper | null = null;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    wrapper = null;
  });

  it('should render', () => {
    wrapper = mount(<UseStateRefHook />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should return a ref for the state value', () => {
    wrapper = mount(<UseStateRefHook value={INIT_VALUE} />);
    const [state] = getState<string>(wrapper);
    expect(typeof state).toEqual('object');
    expect(state).toHaveProperty('current');
  });

  it('should set initial state to undefined with no passed value', () => {
    wrapper = mount(<UseStateRefHook />);
    const [state] = getState<string>(wrapper);
    expect(state.current).toEqual(undefined);
  });

  it('should set initial state to passed value', () => {
    wrapper = mount(<UseStateRefHook value={INIT_VALUE} />);
    const [state] = getState<string>(wrapper);
    expect(state.current).toEqual(INIT_VALUE);
  });

  it('should update value to new value passed to setState', () => {
    const VALUE = 'value';
    wrapper = mount(<UseStateRefHook value={INIT_VALUE} />);
    const [state, setState] = getState<string>(wrapper);
    expect(state.current).toEqual(VALUE);

    const NEW_VALUE = 'new value';
    act(() => {
      setState(NEW_VALUE);
    });
    expect(state.current).toEqual(NEW_VALUE);
  });
});
