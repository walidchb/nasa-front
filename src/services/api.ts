import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const retryRequest = async <T>(
  requestFunc: () => Promise<AxiosResponse<T>>
): Promise<AxiosResponse<T>> => {
  try {
    return await requestFunc();
  } catch (error) {
    throw error;
  }
};

export const fetchData = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig<T>
): Promise<AxiosResponse<T>> => {
  try {
    return await api.get<T>(endpoint, config);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 401
    ) {
      return retryRequest(() => api.get<T>(endpoint, config));
    }
    throw error;
  }
};
