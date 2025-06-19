import axios from "axios";
import {
  getAccessToken,
  removeLocalStorageToken,
} from "./helper";

export const AUTH_REQUEST = axios.create();
export const API_REQUEST = axios.create();

AUTH_REQUEST.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AUTH_REQUEST.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    if (response.status == 401) {
      alert("Forbidden")
      removeLocalStorageToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
