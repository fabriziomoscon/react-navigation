import React, { PropTypes } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, DrawerNavigator, DrawerItems, DrawerItem } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';

const styles = StyleSheet.create({
  drawerContainer: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
  drawerContainerInner: {
    marginTop: 0,
    paddingVertical: 0,
  },
});

const CustomDrawerItem = (props) => {
  const { item, focused, activeTintColor, inactiveTintColor } = props;
  const tintColor = focused ? activeTintColor : inactiveTintColor;

  const screenOptions = typeof item.screenOptions === 'function'
    ? item.screenOptions(props)
    : item.screenOptions;
  const { drawerIcon, drawerLabel, drawerOnPress } = screenOptions;

  return (
    <DrawerItem
      {...props}
      focused={false}
      icon={drawerIcon ? drawerIcon({ tintColor }) : null}
      label={drawerLabel}
      onPress={drawerOnPress}
    />
  );
};

const UnconnectedCustomDrawerItems = ({ showAccounts, accountItems, items, ...props }) => {
  console.log('@@@ showAccounts', showAccounts);

  if (showAccounts) {
    return (
      <View style={[styles.drawerContainer]}>
        {accountItems.map((item) => (
          <CustomDrawerItem {...props} key={item.key} item={item} />
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.drawerContainer]}>
      {items.map((item) => {
        const { routeName, key } = item;

        // Simply render the default component if the item is a route.
        if (routeName) {
          return (
            <DrawerItems
              {...props}
              key={key}
              items={[item]}
              style={styles.drawerContainerInner}
            />
          );
        }

        return <CustomDrawerItem {...props} key={key} item={item} />;
      })}
    </View>
  );
};

const mapDrawerStateToProps = state => ({
  showAccounts: state.drawerView.showAccounts,
  accountItems: state.drawerView.accountItems,
});

const CustomDrawerItems = connect(mapDrawerStateToProps)(UnconnectedCustomDrawerItems);

export const AppNavigator = DrawerNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
}, {
  contentComponent: CustomDrawerItems,
  contentOptions: {
    items: [
      {
        key: 'ShowAccounts',
        screenOptions: ({ navigation }) => ({
          drawerLabel: 'Show Accounts',
          drawerOnPress: () => {
            navigation.dispatch({ type: 'ShowAccounts' });
          }
        }),
      },
      { key: 'Login', routeName: 'Login' },
      { key: 'Main', routeName: 'Main' },
      { key: 'Profile', routeName: 'Profile' },
    ],
  },
});

const AppWithNavigationState = ({ dispatch, nav }) => {
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
});

export default connect(mapStateToProps)(AppWithNavigationState);
