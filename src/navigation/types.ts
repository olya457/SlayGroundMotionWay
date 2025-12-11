export type BottomTabParamList = {
  home: undefined;
  saved: undefined;
  profile: undefined;
  settings: undefined;
};

export type RootStackParamList = {
  loader: undefined;
  onboarding: undefined;
  registration: undefined;
  tabs: undefined;

  getTheFacts: undefined;         
  places: undefined;              
  placeDetail: { id: string };     
};
