import axios from "axios";
import { authService } from "./auth.service";

const BASE_URL = 'http://api.audithive.in/api/v1';
//const BASE_URL = 'http://13.126.14.135:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors or cases where error.response is undefined
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Check if error is due to token expiration
    const isTokenExpiredError =
      error.response.status === 401 &&
      (error.response.data?.detail?.toLowerCase().includes("token") ||
        error.response.data?.detail?.toLowerCase().includes("expired") ||
        error.response.data?.message?.toLowerCase().includes("token") ||
        error.response.data?.message?.toLowerCase().includes("expired"));

    // Only handle token expiration errors
    if (isTokenExpiredError) {
      // If this is already a retry attempt, logout
      if (originalRequest._retry) {
        authService.logout();
        return Promise.reject(error);
      }

      // Try to refresh the token
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          authService.logout();
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(`${BASE_URL}/token/refresh`, {
          refresh: refreshToken,
        });

        const { access_token } = response.data;

        // Update the access token
        localStorage.setItem("access_token", access_token);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Only logout if refresh token is invalid/expired
        if (refreshError.response?.status === 401) {
          authService.logout();
        }
        return Promise.reject(refreshError);
      }
    }

    // For non-token related errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api;
