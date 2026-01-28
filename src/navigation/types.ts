import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  HomeTab: { showWelcome?: boolean };
  OrderTab: undefined;
  CollectionTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Splash: { showWelcome?: boolean };
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Parts: undefined;
  Cart: undefined;
  CampaignList: undefined;
  CampaignDetail: { campaignId: string };
  OrderDetail: { orderNumber: string };
};
