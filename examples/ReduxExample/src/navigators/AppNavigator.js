import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';

const DrawerNav = DrawerNavigator({
  LoginTabs: {
    screen: TabNavigator({
      Login: { screen: LoginScreen },
    })
  },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
});

const AppWithoutNavigationState = () => (
  <DrawerNav />
);

export const AppNavigator = StackNavigator({
  Root: {
    screen: AppWithoutNavigationState,
  },
  SomethingElse: { screen: () => null },
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
