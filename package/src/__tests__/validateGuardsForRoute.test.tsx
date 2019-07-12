import { createBrowserHistory } from 'history';
import { getNextFn, runGuard } from '../validateGuardsForRoute';
import { GuardTypes } from '../types';

describe('validateGuardsForRoute', () => {
  const FROM_ROUTE_PROPS = {
    history: createBrowserHistory(),
    match: {
      params: {},
      isExact: true,
      path: '',
      url: '/',
    },
    location: {
      hash: 'k12dr',
      pathname: '/',
      search: '',
      state: {},
    },
  };
  const TO_ROUTE_PROPS = {
    ...FROM_ROUTE_PROPS,
    meta: {},
  };

  describe('getNextFn', () => {
    let value: any;
    let callback: jest.Mock;

    beforeEach(() => {
      value = null;
      callback = jest.fn(obj => {
        value = obj;
      });
    });

    it('should return a function', () => {
      const next = getNextFn(() => null);
      expect(typeof next).toEqual('function');
    });

    it('should have properties "props" and "redirect" that are also functions', () => {
      const next = getNextFn(() => null);
      expect(typeof next.props).toEqual('function');
      expect(typeof next.redirect).toEqual('function');
    });

    it('when calling next(), should call the given callback function with the continue type', () => {
      const next = getNextFn(callback);
      next();
      expect(callback.mock.calls.length).toEqual(1);
      expect(value).toEqual({ type: GuardTypes.CONTINUE });
    });

    it('when calling next.props(), should call the given callback function with the props type and the passed arg as payload', () => {
      const PROPS = { hello: 'world' };
      const next = getNextFn(callback);
      next.props(PROPS);
      expect(callback.mock.calls.length).toEqual(1);
      expect(value).toEqual({ type: GuardTypes.PROPS, payload: PROPS });
    });

    it('when calling next.redirect(), should call the given callback function with the redirect type and the passed arg as payload', () => {
      const REDIRECT = '/ok';
      const next = getNextFn(callback);
      next.redirect(REDIRECT);
      expect(callback.mock.calls.length).toEqual(1);
      expect(value).toEqual({ type: GuardTypes.REDIRECT, payload: REDIRECT });

      const OBJ_REDIRECT = { pathname: '/ok', search: '?hello=world' };
      next.redirect(OBJ_REDIRECT);
      expect(callback.mock.calls.length).toEqual(2);
      expect(value).toEqual({ type: GuardTypes.REDIRECT, payload: OBJ_REDIRECT });
    });
  });

  describe('runGuard', () => {
    let guard: jest.Mock;

    beforeEach(() => {
      guard = jest.fn((to, from, next) => next());
    });

    it('should return a promise', () => {
      const promise = runGuard(guard, TO_ROUTE_PROPS, FROM_ROUTE_PROPS);
      expect(promise).toHaveProperty('then');
      // eslint-disable-next-line promise/prefer-await-to-then
      expect(typeof promise.then).toEqual('function');
    });

    it('should call the passed guard', async () => {
      await runGuard(guard, TO_ROUTE_PROPS, FROM_ROUTE_PROPS);
      expect(guard.mock.calls.length).toEqual(1);
    });

    it('should reject promise on guard failure', async () => {
      const ERR_MSG = 'Route not found';
      guard = jest.fn(() => {
        throw new Error(ERR_MSG);
      });

      let value = 'ok';
      try {
        await runGuard(guard, TO_ROUTE_PROPS, FROM_ROUTE_PROPS);
      } catch (error) {
        value = error.message;
      }
      expect(value).toEqual(ERR_MSG);
    });

    it('should return guard payload object on guard success', async () => {
      const value = await runGuard(guard, TO_ROUTE_PROPS, FROM_ROUTE_PROPS);
      expect(typeof value).toEqual('object');
      expect(value).toEqual({ type: GuardTypes.CONTINUE });
    });
  });
});
