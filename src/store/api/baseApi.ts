import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { axiosInstance } from '@/services/axiosInstance';

const axiosBaseQuery: BaseQueryFn<
  { url: string; method?: AxiosRequestConfig['method']; data?: unknown; params?: unknown },
  unknown,
  unknown
> = async ({ url, method = 'GET', data, params }) => {
  try {
    const result = await axiosInstance({ url, method, data, params });
    return { data: result.data };
  } catch (err) {
    const error = err as AxiosError;
    return {
      error: {
        status: error.response?.status,
        data: error.response?.data ?? error.message,
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: [],
  endpoints: () => ({}),
});
