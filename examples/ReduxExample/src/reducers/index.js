import { combineReducers } from 'redux';
import { NavigationActions, StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
const initialNavState = {
  index: 1,
  routes: [
    { key: 'InitA', routeName: 'Main' },
    { key: 'InitB', routeName: 'Login' },
  ],
};

const StackInStack = StackNavigator({
  StackB: { screen: () => null },
});
const TestNavigator = StackNavigator({
  StackA: { screen: StackInStack },
});
const testState = TestNavigator.router.getStateForAction(TestNavigator.router.getActionForPathAndParams('StackA'));
console.log('@@@ testState', JSON.stringify(testState, null, '  '));

const initialAuthState = { isLoggedIn: false };

function nav(state = initialNavState, action) {
  switch (action.type) {
    case 'Login':
      return AppNavigator.router.getStateForAction(NavigationActions.back(), state);
    case 'Logout':
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
    default:
      return AppNavigator.router.getStateForAction(action, state);
  }
}

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  nav,
  auth,
});

export default AppReducer;
