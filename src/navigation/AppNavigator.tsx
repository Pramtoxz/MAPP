import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import SplashScreen from '../components/SplashScreen';
import LoginScreen from '../Screens/Auth/LoginScreen';
import OtpVerifyScreen from '../Screens/Auth/OtpVerifyScreen';
import MainTabNavigator from './MainTabNavigator';
import CartScreen from '../Screens/Cart/CartScreen';
import NotificationScreen from '../Screens/Notification/NotificationScreen';
import CampaignListScreen from '../Screens/Campaign/CampaignListScreen';
import CampaignDetailScreen from '../Screens/Campaign/CampaignDetailScreen';
import OrderDetailScreen from '../Screens/Order/OrderDetailScreen';
import BackOrderScreen from '../Screens/Order/BackOrderScreen';
import CollectionScreen from '../Screens/Collection/CollectionScreen';
import InvoiceDetailScreen from '../Screens/Collection/InvoiceDetailScreen';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen';
import ChangePinScreenWrapper from '../Screens/Profile/ChangePinScreenWrapper';
import CatalogueScreen from '../Screens/Profile/CatalogueScreen';
import CataloguePDFScreen from '../Screens/Profile/CataloguePDFScreen';
import PrivacyPolicyScreen from '../Screens/Profile/PrivacyPolicyScreen';
import SetupCollectionPinScreen from '../Screens/Collection/SetupCollectionPinScreen';

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
        <Stack.Screen 
          name="OtpVerify" 
          component={OtpVerifyScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="Notification" 
          component={NotificationScreen}
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
        <Stack.Screen 
          name="OrderDetail" 
          component={OrderDetailScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="BackOrder" 
          component={BackOrderScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="Collection" 
          component={CollectionScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="InvoiceDetail" 
          component={InvoiceDetailScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="ChangePin" 
          component={ChangePinScreenWrapper}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="Catalogue" 
          component={CatalogueScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="CataloguePDF" 
          component={CataloguePDFScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="SetupCollectionPin" 
          component={SetupCollectionPinScreen}
          options={{
            presentation: 'card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
