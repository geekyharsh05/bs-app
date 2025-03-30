import axios from 'axios';
import { BASE_API_URL } from '@/constants/config';
import { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth-type';

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await axios.post<AuthResponse>(`${BASE_API_URL}/auth/register`, payload);
  return data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await axios.post<AuthResponse>(`${BASE_API_URL}/auth/login`, payload);
  return data;
};

