import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, DrawerNavigator, StackNavigator } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';

export const AppNavigator = DrawerNavigator({
  LoginStack: { screen: StackNavigator({ Login: { screen: LoginScreen } }) },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
});

export const RootStackNav = StackNavigator({ Root: { screen: AppNavigator } });

const AppWithNavigationState = ({ dispatch, nav }) => (
  <RootStackNav navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
