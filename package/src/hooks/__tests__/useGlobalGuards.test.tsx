import React from 'react';
import { mount } from 'enzyme';
import { GuardFunction } from '../../types';
import { GuardContext } from '../../contexts';
import useGlobalGuards from '../useGlobalGuards';

interface UseGlobalGuardsHookProps {
  guards?: GuardFunction[];
  ignoreGlobal?: boolean;
}
const UseGlobalGuardsHook: React.FC<UseGlobalGuardsHookProps> = ({ guards, ignoreGlobal }) => {
  const hookGuards = useGlobalGuards(guards, ignoreGlobal);
  return <div data-guards={hookGuards} />;
};

const testGuardOne: GuardFunction = (to, from, next) => next();
const testGuardTwo: GuardFunction = (to, from, next) => next.props({});
const testGuardThree: GuardFunction = (to, from, next) => next.redirect('');

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

  it('should use only passed guards prop when no outer context provided', () => {
    const GUARDS = [testGuardOne];
    const wrapper = mount(<UseGlobalGuardsHook guards={GUARDS} />);
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(1);
    const guardNames = guards.map(func => func.name).join(' ');
    expect(guardNames).toEqual('testGuardOne');
    wrapper.unmount();
  });

  it('should use only context guards when no guard props provided', () => {
    const GUARDS = [testGuardOne];
    const wrapper = mount(
      <GuardContext.Provider value={GUARDS}>
        <UseGlobalGuardsHook />
      </GuardContext.Provider>,
    );
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(1);
    const guardNames = guards.map(func => func.name).join(' ');
    expect(guardNames).toEqual('testGuardOne');
    wrapper.unmount();
  });

  it('should add prop guards to a queue behind given context guards', () => {
    const CONTEXT_GUARDS = [testGuardTwo];
    const PROP_GUARDS = [testGuardOne, testGuardThree];
    const wrapper = mount(
      <GuardContext.Provider value={CONTEXT_GUARDS}>
        <UseGlobalGuardsHook guards={PROP_GUARDS} />
      </GuardContext.Provider>,
    );
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(3);
    const guardNames = guards.map(func => func.name).join(' ');
    expect(guardNames).toEqual('testGuardTwo testGuardOne testGuardThree');
    wrapper.unmount();
  });

  it('should not use context guards if ignoreGlobal arg is set to true', () => {
    const CONTEXT_GUARDS = [testGuardTwo];
    const PROP_GUARDS = [testGuardOne, testGuardThree];
    const wrapper = mount(
      <GuardContext.Provider value={CONTEXT_GUARDS}>
        <UseGlobalGuardsHook guards={PROP_GUARDS} ignoreGlobal />
      </GuardContext.Provider>,
    );
    const guards: GuardFunction[] = wrapper.find('div').prop('data-guards');
    expect(guards.length).toEqual(2);
    const guardNames = guards.map(func => func.name).join(' ');
    expect(guardNames).toEqual('testGuardOne testGuardThree');
    wrapper.unmount();
  });
});
