export type RootStackParamList = {
  Splash: { showWelcome?: boolean };
  Login: undefined;
  MainTabs: undefined;
  Parts: undefined;
  Cart: undefined;
  CampaignList: undefined;
  CampaignDetail: { campaignId: string };
};

export type MainTabParamList = {
  HomeTab: { showWelcome?: boolean };
  OrderTab: undefined;
  CollectionTab: undefined;
  ProfileTab: undefined;
};
