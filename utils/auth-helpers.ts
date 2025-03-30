import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth-store';

export const checkAuth = async () => {
  const token = await AsyncStorage.getItem('token');
  const userJson = await AsyncStorage.getItem('user');
  if (token && userJson) {
    useAuthStore.setState({ token, user: JSON.parse(userJson) });
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  useAuthStore.getState().clearAuth();
};
