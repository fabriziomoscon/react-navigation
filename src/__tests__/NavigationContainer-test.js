/* @flow */

import React from 'react';
import 'react-native';

import renderer from 'react-test-renderer';
import ReactUpdates from 'react-test-renderer/lib/ReactUpdates';

import NavigationActions from '../NavigationActions';
import StackNavigator from '../navigators/StackNavigator';

const FooScreen = () => <div />;
const BarScreen = () => <div />;
const BazScreen = () => <div />;
const NavigationContainer = StackNavigator(
  {
    foo: {
      screen: FooScreen,
    },
    bar: {
      screen: BarScreen,
    },
    baz: {
      screen: BazScreen,
    },
  },
  {
    initialRouteName: 'foo',
  },
);

// Replace React's test batching strategy with one that flushed by jest's mock timers
function tick() {
  setImmediate(() => {
    ReactUpdates.flushBatchedUpdates();
    tick();
  });
}

ReactUpdates.injection.injectBatchingStrategy({
  isBatchingUpdates: true,
  batchedUpdates(
    callback: (a: mixed, b: mixed, c: mixed, d: mixed, e: mixed) => mixed,
    a: mixed,
    b: mixed,
    c: mixed,
    d: mixed,
    e: mixed,
  ) {
    return callback(a, b, c, d, e);
  },
});

jest.useFakeTimers();
tick();

describe('NavigationContainer', () => {
  describe('state.nav', () => {
    it("should be preloaded with the router's initial state", () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      expect(navigationContainer.state.nav).toMatchObject({ index: 0 });
      expect(navigationContainer.state.nav.routes).toBeInstanceOf(Array);
      expect(navigationContainer.state.nav.routes.length).toBe(1);
      expect(navigationContainer.state.nav.routes[0]).toMatchObject({
        routeName: 'foo',
      });
    });
  });

  describe('dispatch', () => {
    it('returns true when given a valid action', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      jest.runOnlyPendingTimers();
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' }),
        ),
      ).toEqual(true);
    });

    it('returns false when given an invalid action', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      jest.runOnlyPendingTimers();
      expect(navigationContainer.dispatch(NavigationActions.back())).toEqual(
        false,
      );
    });

    it('updates state.nav with an action by the next tick', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();

      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' }),
        ),
      ).toEqual(true);

      // Fake the passing of a tick
      jest.runOnlyPendingTimers();

      expect(navigationContainer.state.nav).toMatchObject({
        index: 1,
        routes: [{ routeName: 'foo' }, { routeName: 'bar' }],
      });
    });

    it('does not discard actions when called twice in one tick', () => {
      const navigationContainer = renderer
        .create(<NavigationContainer />)
        .getInstance();
      const initialState = JSON.parse(
        JSON.stringify(navigationContainer.state.nav),
      );

      // First dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'bar' }),
        ),
      ).toEqual(true);

      // Make sure that the test runner has NOT synchronously applied setState before the tick
      expect(navigationContainer.state.nav).toMatchObject(initialState);

      // Second dispatch
      expect(
        navigationContainer.dispatch(
          NavigationActions.navigate({ routeName: 'baz' }),
        ),
      ).toEqual(true);

      // Fake the passing of a tick
      jest.runOnlyPendingTimers();

      expect(navigationContainer.state.nav).toMatchObject({
        index: 2,
        routes: [
          { routeName: 'foo' },
          { routeName: 'bar' },
          { routeName: 'baz' },
        ],
      });
    });
  });
});
