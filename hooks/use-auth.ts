import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser } from '@/lib/auth-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth-store';
import Toast from 'react-native-toast-message';
import { RegisterPayload, LoginPayload, AuthResponse } from '@/types/auth-type';

export const useRegister = () => {
  const { setUser, setToken } = useAuthStore();

  return useMutation<AuthResponse, any, RegisterPayload>({
    mutationFn: (payload) => registerUser(payload),

    onSuccess: async (data) => {
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
      setUser(data.user);
      setToken(data.token);

      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: `Welcome, ${data.user.username}! 🎉`,
      });
    },

    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error?.response?.data?.message || 'Something went wrong',
      });
    },
  });
};

export const useLogin = () => {
  const { setUser, setToken } = useAuthStore();

  return useMutation<AuthResponse, any, LoginPayload>({
    mutationFn: (payload) => loginUser(payload),

    onSuccess: async (data) => {
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
      setUser(data.user);
      setToken(data.token);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome back, ${data.user.username}! 👋`,
      });
    },

    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.response?.data?.message || 'Invalid email or password',
      });
    },
  });
};
