import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
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

const getGuards = (wrapper: ReactWrapper): GuardFunction[] =>
  wrapper.find('div').prop('data-guards');
const getGuardNames = (guards: GuardFunction[]) => guards.map(func => func.name).join(' ');

describe('usePrevious', () => {
  let wrapper: ReactWrapper | null = null;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    wrapper = null;
  });

  it('should render', () => {
    wrapper = mount(<UseGlobalGuardsHook />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have 0 guards with no props or outer context', () => {
    wrapper = mount(<UseGlobalGuardsHook />);
    const guards: GuardFunction[] = getGuards(wrapper);
    expect(guards.length).toEqual(0);
  });

  it('should use only prop guards when no outer context provided', () => {
    const GUARDS = [guardOne];
    wrapper = mount(<UseGlobalGuardsHook guards={GUARDS} />);
    const guards = getGuards(wrapper);
    expect(guards.length).toEqual(GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardOne');
  });

  it('should use only prop guards when empty guard context provided', () => {
    const GUARDS = [guardOne];
    wrapper = mount(
      <GuardContext.Provider value={[]}>
        <UseGlobalGuardsHook guards={GUARDS} />
      </GuardContext.Provider>,
    );
    const guards = getGuards(wrapper);
    expect(guards.length).toEqual(GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardOne');
  });

  it('should use only context guards when no guard props provided', () => {
    const GUARDS = [guardOne];
    wrapper = mount(
      <GuardContext.Provider value={GUARDS}>
        <UseGlobalGuardsHook />
      </GuardContext.Provider>,
    );
    const guards = getGuards(wrapper);
    expect(guards.length).toEqual(GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardOne');
  });

  it('should add prop guards to a queue behind given context guards', () => {
    const CONTEXT_GUARDS = [guardTwo];
    const PROP_GUARDS = [guardOne, guardThree];
    wrapper = mount(
      <GuardContext.Provider value={CONTEXT_GUARDS}>
        <UseGlobalGuardsHook guards={PROP_GUARDS} />
      </GuardContext.Provider>,
    );
    const guards = getGuards(wrapper);
    expect(guards.length).toEqual(CONTEXT_GUARDS.length + PROP_GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardTwo guardOne guardThree');
  });

  it('should not use context guards if ignoreGlobal arg is set to true', () => {
    const CONTEXT_GUARDS = [guardTwo];
    const PROP_GUARDS = [guardOne, guardThree];
    wrapper = mount(
      <GuardContext.Provider value={CONTEXT_GUARDS}>
        <UseGlobalGuardsHook guards={PROP_GUARDS} ignoreGlobal />
      </GuardContext.Provider>,
    );
    const guards = getGuards(wrapper);
    expect(guards.length).toEqual(PROP_GUARDS.length);
    expect(getGuardNames(guards)).toEqual('guardOne guardThree');
  });
});
