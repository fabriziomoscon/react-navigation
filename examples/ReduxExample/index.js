/**
 * @flow
 */

import React from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NavigationActions,
  addNavigationHelpers,
  StackNavigator,
  DrawerNavigator,
} from 'react-navigation';
import {
  Provider,
  connect,
} from 'react-redux';
import {
  createStore,
  combineReducers,
} from 'redux';
import {
  persistStore,
  autoRehydrate,
} from 'redux-persist';

const ProfileScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
      Profile Screen
    </Text>
  </View>
);
ProfileScreen.navigationOptions = {
  title: 'Profile',
};

const LoginScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
      Screen A
    </Text>
    <Text style={styles.instructions}>
      This is great
    </Text>
    <Button
      onPress={() => navigation.dispatch({ type: 'Login' })}
      title="Log in"
    />
  </View>
);
LoginScreen.navigationOptions = {
  title: 'Log In',
};


const LoginStatusMessage = connect(state => ({
  isLoggedIn: state.auth.isLoggedIn,
}))(({ isLoggedIn, dispatch }) => {
  if (!isLoggedIn) {
    return <Text>Please log in</Text>;
  }
  return (
    <View>
      <Text style={styles.welcome}>
        {'You are "logged in" right now'}
      </Text>
      <Button
        onPress={() => dispatch(NavigationActions.navigate({ routeName: 'Profile' }))}
        title="Profile"
      />
    </View>
  );
});

const AuthButton = connect(state => ({
  isLoggedIn: state.auth.isLoggedIn,
}), dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  login: () => dispatch(NavigationActions.navigate({ routeName: 'Login' })),
}))(({ logout, login, isLoggedIn }) => (
  <Button
    title={isLoggedIn ? 'Log Out' : 'Log In'}
    onPress={isLoggedIn ? logout : login}
  />
));

const MainScreen = () => (
  <View style={styles.container}>
    <LoginStatusMessage />
    <AuthButton />
  </View>
);
MainScreen.navigationOptions = {
  title: 'Home Screen',
};

const AppStackNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
});

const RootNavigator = DrawerNavigator({
  App: { screen: AppStackNavigator },
});

const AppWithNavigationState = connect(state => ({
  nav: state.nav,
}))(({ dispatch, nav }) => (
  <RootNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
));

const initialNavState = {
  index: 0,
  routes: [
    { key: 'InitA', routeName: 'App' },
  ],
};

const initialAuthState = { isLoggedIn: false };

const AppReducer = combineReducers({
  nav: (state = initialNavState, action) => {
    if (action.type === 'Login') {
      return RootNavigator.router.getStateForAction(NavigationActions.back(), state);
    }
    if (action.type === 'Logout') {
      return RootNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
    }
    return RootNavigator.router.getStateForAction(action, state);
  },
  auth: (state = initialAuthState, action) => {
    if (action.type === 'Login') {
      return { ...state, isLoggedIn: true };
    }
    if (action.type === 'Logout') {
      return { ...state, isLoggedIn: false };
    }
    return state;
  },
});

class ReduxExampleApp extends React.Component {
  store = createStore(AppReducer, undefined, autoRehydrate());

  componentDidMount() {
    persistStore(this.store, { storage: AsyncStorage });
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReduxExample', () => ReduxExampleApp);
