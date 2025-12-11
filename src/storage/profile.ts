import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
  name: string;
  photoUri?: string | null;
};

const PROFILE_KEY = 'sgmw_profile_v1';

export async function saveProfile(data: UserProfile) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function clearProfile() {
  await AsyncStorage.removeItem(PROFILE_KEY);
}
