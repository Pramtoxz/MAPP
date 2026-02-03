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
  OtpVerify: { phone: string };
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Cart: undefined;
  CampaignList: undefined;
  CampaignDetail: { campaignId: string };
  OrderDetail: { orderNumber: string };
  EditProfile: undefined;
  PrivacyPolicy: undefined;
};
