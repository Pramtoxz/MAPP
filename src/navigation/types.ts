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
  Notification: undefined;
  CampaignList: undefined;
  CampaignDetail: { campaignId: string };
  OrderDetail: { orderNumber: string };
  BackOrder: { orderNumber: string };
  Collection: undefined;
  InvoiceDetail: { noFaktur: string };
  EditProfile: undefined;
  ChangePin: undefined;
  Catalogue: undefined;
  PrivacyPolicy: undefined;
  SetupCollectionPin: undefined;
};
