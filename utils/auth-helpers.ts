import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth-store';

export const checkAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userJson = await AsyncStorage.getItem('user');
    if (token && userJson) {
      useAuthStore.setState({ token, user: JSON.parse(userJson) });
    }
  } catch (error) {
    console.log("Auth failed", error)
  } finally {
    useAuthStore.setState({isCheckingAuth: false})
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  useAuthStore.getState().clearAuth();
};
