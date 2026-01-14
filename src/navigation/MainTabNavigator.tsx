import React from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../config/colors';
import { fonts } from '../config/fonts';
import { getImage } from '../assets/images';
import { MainTabParamList } from './types';
import HomeScreen from '../Screens/Home/HomeScreen';
import OrderScreen from '../Screens/Order/OrderScreen';
import CollectionScreen from '../Screens/Collection/CollectionScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grayInactive,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={getImage('ic_homepage.png')}
              style={[styles.tabIcon, { tintColor: color, width: size, height: size }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrderScreen}
        options={{
          tabBarLabel: 'Order',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={getImage('ic_menu_katalog_en.png')}
              style={[styles.tabIcon, { tintColor: color, width: size, height: size }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CollectionTab"
        component={CollectionScreen}
        options={{
          tabBarLabel: 'Collection',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={getImage('ic_menu_katalog_en.png')}
              style={[styles.tabIcon, { tintColor: color, width: size, height: size }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={getImage('ic_profile.png')}
              style={[styles.tabIcon, { tintColor: color, width: size, height: size }]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.semibold,
  },
  tabIcon: {
    resizeMode: 'contain',
  },
});

export default MainTabNavigator;
