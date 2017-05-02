import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { getAppNavigator } from '../navigators/AppNavigator';

function getInitialNavState() {
  const AppNavigator = getAppNavigator();

  // Start with two routes: The Main screen, with the Login screen on top.
  const tempState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Main' }));
  const initialNavState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), tempState);
  return initialNavState;
}

function nav(state = getInitialNavState(), action) {
  const AppNavigator = getAppNavigator();

  let nextState;
  switch (action.type) {
    case 'Drawer':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'DrawerOpen' }), state);
      break;
    case 'Login':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.back(), state);
      break;
    case 'Logout':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

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

const initialDrawerState = { showAccounts: false };

function drawerView(state = initialDrawerState, action) {
  switch (action.type) {
    case 'ShowAccounts':
      return { ...state, showAccounts: true };
    case 'HideAccounts':
      return { ...state, showAccounts: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  nav,
  auth,
  drawerView,
});

export default AppReducer;
