/* @flow */

import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';

import DrawerNavigatorItem from './DrawerNavigatorItem';

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationAction,
  NavigationRoute,
  Style,
} from '../../TypeDefinition';
import type { DrawerScene } from './DrawerView.js';

type Props = {
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  items?: Array<NavigationRoute>,
  itemComponent: ReactClass<*>,
  style?: Style,
  activeTintColor?: string,
  activeBackgroundColor?: string,
  inactiveTintColor?: string,
  inactiveBackgroundColor?: string,
  getLabel: (scene: DrawerScene) => ?(React.Element<*> | string),
  renderIcon: (scene: DrawerScene) => ?React.Element<*>,
  getScreenOptions: (routeKey: string) => { drawerOnPress?: () => void },
};

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = (
  {
    navigation,
    items,
    itemComponent: ItemComponent,
    style,
    activeTintColor,
    activeBackgroundColor,
    inactiveTintColor,
    inactiveBackgroundColor,
    getLabel,
    renderIcon,
    getScreenOptions,
    ...drawerItemProps
  }: Props,
) => (
  <View style={[styles.container, style]}>
    {(items || navigation.state.routes)
      .map((route: NavigationRoute, index: number) => {
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
          <ItemComponent
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

DrawerNavigatorItems.defaultProps = {
  itemComponent: DrawerNavigatorItem,
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
});

export default DrawerNavigatorItems;
