import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../config/colors';
import { fonts } from '../config/fonts';
import { getImage } from '../assets/images';
import { MainTabParamList } from './types';
import HomeScreen from '../Screens/Home/HomeScreen';
import OrderScreen from '../Screens/Order/OrderScreen';
import CollectionScreenWrapper from '../Screens/Collection/CollectionScreenWrapper';
import ProfileScreen from '../Screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Extract tab icons to prevent unstable nested components
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Image
    source={getImage('home.png')}
    style={[styles.tabIcon, { tintColor: color, width: size, height: size }]}
  />
);

const OrderIcon = ({ color, size }: { color: string; size: number }) => (
  <Image
    source={getImage('order.png')}
    style={[styles.tabIcon, { tintColor: color, width: size, height: size }]}
  />
);

const CollectionIcon = ({ color, size }: { color: string; size: number }) => (
  <Image
    source={getImage('collection.png')}
    style={[styles.tabIcon, { tintColor: color, width: size, height: size }]}
  />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Image
    source={getImage('profile.png')}
    style={[styles.tabIcon, { tintColor: color, width: size, height: size }]}
  />
);

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
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrderScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: OrderIcon,
        }}
      />
      <Tab.Screen
        name="CollectionTab"
        component={CollectionScreenWrapper}
        options={{
          tabBarLabel: 'Collection',
          tabBarIcon: CollectionIcon,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileIcon,
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
