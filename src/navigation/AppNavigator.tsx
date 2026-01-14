import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import SplashScreen from '../components/SplashScreen';
import LoginScreen from '../Screens/Auth/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import PartsScreen from '../Screens/Parts/PartsScreen';
import CartScreen from '../Screens/Cart/CartScreen';
import CampaignListScreen from '../Screens/Campaign/CampaignListScreen';
import CampaignDetailScreen from '../Screens/Campaign/CampaignDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          presentation: 'card',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen 
          name="Parts" 
          component={PartsScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="CampaignList" 
          component={CampaignListScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="CampaignDetail" 
          component={CampaignDetailScreen}
          options={{
            presentation: 'card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
