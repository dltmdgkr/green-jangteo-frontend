import axios, { AxiosError, AxiosInstance } from 'axios';
import { BASE_URL } from '../constant/union';

const customAxios: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

customAxios.interceptors.request.use(
  config => {
    const token = JSON.parse(localStorage.getItem('token') as string);

    if (config.headers && token) {
      const refreshToken = JSON.parse(
        localStorage.getItem('refreshToken') as string,
      );
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['refreshToken'] = `Bearer ${refreshToken}`;
    }

    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  },
);

customAxios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const err = error as AxiosError;

    if (err.code === 'ERR_BAD_REQUEST') {
      const originalRequest = error.config;
      const refreshToken = JSON.parse(
        localStorage.getItem('refreshToken') as string,
      );

      const response = await axios.post(
        `${BASE_URL}/token?refreshToken=${refreshToken}`,
      );
      const newAccessToken = response.data;

      originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    }

    return Promise.reject(err);
  },
);

export default customAxios;
