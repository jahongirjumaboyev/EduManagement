import axios from 'axios';
import type { AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';

// Injected from main.tsx after the store is created to avoid a circular import
// (axiosInstance → store → baseApi → axiosInstance).
let _dispatch: AppDispatch | null = null;

export function injectStore(dispatch: AppDispatch) {
  _dispatch = dispatch;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      _dispatch?.(logout());
    }
    return Promise.reject(error);
  }
);
