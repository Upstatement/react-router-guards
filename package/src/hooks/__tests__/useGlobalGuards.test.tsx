import React from 'react';
import { mount } from 'enzyme';
import { GuardFunction } from '../../types';
import { GuardContext } from '../../contexts';
import useGlobalGuards from '../useGlobalGuards';

const guardOne: GuardFunction = (to, from, next) => next();
const guardTwo: GuardFunction = (to, from, next) => next.props({});
const guardThree: GuardFunction = (to, from, next) => next.redirect('');

interface UseGlobalGuardsHookProps {
  guards?: GuardFunction[];
  ignoreGlobal?: boolean;
}
const UseGlobalGuardsHook: React.FC<UseGlobalGuardsHookProps> = ({ guards, ignoreGlobal }) => {
  const hookGuards = useGlobalGuards(guards, ignoreGlobal);
  return <div data-guards={hookGuards} />;
};

const getGuardNames = (guards: GuardFunction[]) => guards.map(func => func.name).join(' ');

describe('usePrevious', () => {
  it('should render', () => {
    const wrapper = mount(<UseGlobalGuardsHook />);
    expect(wrapper.exists()).toBeTruthy();
    wrapper.unmount();
  });

  it('should have 0 guards with no props or outer context', () => {
    const wrapper = mount(<UseGlobalGuardsHook />);
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(0);
    wrapper.unmount();
  });

  it('should use only prop guards when no outer context provided', () => {
    const GUARDS = [guardOne];
    const wrapper = mount(<UseGlobalGuardsHook guards={GUARDS} />);
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardOne');
    wrapper.unmount();
  });

  it('should use only prop guards when empty guard context provided', () => {
    const GUARDS = [guardOne];
    const wrapper = mount(
      <GuardContext.Provider value={[]}>
        <UseGlobalGuardsHook guards={GUARDS} />
      </GuardContext.Provider>,
    );
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardOne');
    wrapper.unmount();
  });

  it('should use only context guards when no guard props provided', () => {
    const GUARDS = [guardOne];
    const wrapper = mount(
      <GuardContext.Provider value={GUARDS}>
        <UseGlobalGuardsHook />
      </GuardContext.Provider>,
    );
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardOne');
    wrapper.unmount();
  });

  it('should add prop guards to a queue behind given context guards', () => {
    const CONTEXT_GUARDS = [guardTwo];
    const PROP_GUARDS = [guardOne, guardThree];
    const wrapper = mount(
      <GuardContext.Provider value={CONTEXT_GUARDS}>
        <UseGlobalGuardsHook guards={PROP_GUARDS} />
      </GuardContext.Provider>,
    );
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(CONTEXT_GUARDS.length + PROP_GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardTwo guardOne guardThree');
    wrapper.unmount();
  });

  it('should not use context guards if ignoreGlobal arg is set to true', () => {
    const CONTEXT_GUARDS = [guardTwo];
    const PROP_GUARDS = [guardOne, guardThree];
    const wrapper = mount(
      <GuardContext.Provider value={CONTEXT_GUARDS}>
        <UseGlobalGuardsHook guards={PROP_GUARDS} ignoreGlobal />
      </GuardContext.Provider>,
    );
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(PROP_GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardOne guardThree');
    wrapper.unmount();
  });
});
