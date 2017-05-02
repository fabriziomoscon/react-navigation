import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, DrawerNavigator } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';

export const AppNavigator = DrawerNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
}, {
  contentOptions: {
    items: [
      { key: 'Login', routeName: 'Login' },
      { key: 'Main', routeName: 'Main' },
      { key: 'Profile', routeName: 'Profile' },
    ],
  },
});

const AppWithNavigationState = ({ dispatch, nav, showAccounts }) => {
  console.log('@@@ showAccounts', showAccounts);

  return (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })}/>
  );
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
  showAccounts: state.drawerView.showAccounts,
});

export default connect(mapStateToProps)(AppWithNavigationState);
