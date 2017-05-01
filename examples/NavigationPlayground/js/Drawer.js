/**
 * @flow
 */

import React from 'react';
import {
  View,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  DrawerNavigator,
  DrawerItem,
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SampleText from './SampleText';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView style={styles.container}>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('DrawerOpen')}
      title="Open drawer"
    />
    <Button
      onPress={() => navigation.goBack(null)}
      title="Go back"
    />
  </ScrollView>
);

const InboxScreen = ({ navigation }) => (
  <MyNavScreen
    banner={'Inbox Screen'}
    navigation={navigation}
  />
);
InboxScreen.navigationOptions = {
  drawerLabel: 'Inbox',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons
      name="move-to-inbox"
      size={24}
      style={{ color: tintColor }}
    />
  ),
};

const DraftsScreen = ({ navigation }) => (
  <MyNavScreen
    banner={'Drafts Screen'}
    navigation={navigation}
  />
);
DraftsScreen.navigationOptions = {
  drawerLabel: 'Drafts',
  drawerIcon: ({ tintColor }) => (
    <MaterialIcons
      name="drafts"
      size={24}
      style={{ color: tintColor }}
    />
  ),
};

const CustomDrawerItems = (props) => {
  const {
    navigation,
    items,
    style,
    activeTintColor,
    activeBackgroundColor,
    inactiveTintColor,
    inactiveBackgroundColor,
    getLabel,
    renderIcon,
    getScreenOptions,
    ...drawerItemProps
  } = props;

  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => {
          const { state } = navigation;
          const { drawerOnPress } = getScreenOptions(route.key);
          const focused = state.routes[state.index].key === route.key;
          const color = focused ? activeTintColor : inactiveTintColor;
          const backgroundColor = focused
            ? activeBackgroundColor
            : inactiveBackgroundColor;
          const scene = { route, focused, index, tintColor: color };
          const icon = renderIcon(scene);
          const label = getLabel(scene);

          return (
            <CustomDrawerItem
              {...drawerItemProps}
              key={route.key}
              index={index}
              navigation={navigation}
              route={route}
              backgroundColor={backgroundColor}
              tintColor={color}
              icon={icon}
              label={label}
              onPress={drawerOnPress}
            />
          );
        })}
    </View>
  );
};

const CustomDrawerItem = (props) => {
  const { route: item } = props;

  // Simply render the default component if the item is a route.
  if (item.routeName) {
    return (
      <DrawerItem {...props} />
    );
  }

  const screenOptions = typeof item.screenOptions === 'function'
    ? item.screenOptions(props)
    : item.screenOptions;

  const { drawerIcon, drawerLabel } = screenOptions;

  // If it's not a route, override a few of the props to make it render nicely.
  return (
    <DrawerItem
      {...props}
      icon={(iconProps) => drawerIcon ? drawerIcon(iconProps) : null}
      label={() => drawerLabel}
      getScreenOptions={() => screenOptions}
    />
  );
};

const drawerRoutes = {
  Inbox: {
    path: '/',
    screen: InboxScreen,
  },
  Drafts: {
    path: '/sent',
    screen: DraftsScreen,
  },
};

// Add a few custom items along with the regular ones.
//
// This array is optional; if you don't provide it,
// the drawer will automatically show all of your routes that were defined above.
const drawerItems = [
  {
    key: 'RefreshButton',
    screenOptions: ({ navigation }) => ({
      drawerLabel: navigation.state.params.isRefreshing ? 'Refreshing...' : 'Refresh',
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons
          name="refresh"
          size={24}
          style={{ color: tintColor }}
        />
      ),
      drawerOnPress: () => {
        navigation.setParams({ isRefreshing: true });

        // Finish refreshing after a short delay.
        setTimeout(() => {
          navigation.setParams({ isRefreshing: false });
        }, 500);
      },
    })
  },
  {
    key: 'MailboxesLabel',
    screenOptions: {
      drawerLabel: 'Mailboxes',
      drawerOnPress: null,
    }
  },
  { key: 'Inbox', routeName: 'Inbox' },
  { key: 'Drafts', routeName: 'Drafts' },
];

const DrawerExample = DrawerNavigator(drawerRoutes, {
  initialRouteName: 'Drafts',
  contentOptions: {
    activeTintColor: '#e91e63',
    items: drawerItems,
    itemComponent: CustomDrawerItem,
  },
  contentComponent: CustomDrawerItems,
});

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

export default DrawerExample;
