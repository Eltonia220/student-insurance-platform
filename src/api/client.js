import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../config";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Required for cookies/sessions
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token if using sessions
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timeout. Please try again"));
    }

    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection")
      );
    }

    const { status, data } = error.response;
    let errorMessage = data?.message || "An error occurred";

    switch (status) {
      case 401:
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login?sessionExpired=true";
        }
        errorMessage = data?.message || "Session expired. Please login again";
        break;
      case 403:
        errorMessage = "You are not authorized to perform this action";
        break;
      case 404:
        errorMessage = "Resource not found";
        break;
      case 429:
        errorMessage = "Too many requests. Please try again later";
        break;
      case 500:
        errorMessage = "Server error. Please try again later";
        break;
      default:
        errorMessage = `HTTP Error ${status}: ${data?.message || "Unknown error"}`;
        break;
    }

    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        config: error.config,
        response: error.response,
        message: errorMessage,
      });
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function to get CSRF token
function getCSRFToken() {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
}

// API methods
export const get = (url, config) => apiClient.get(url, config);
export const post = (url, data, config) => apiClient.post(url, data, config);
export const put = (url, data, config) => apiClient.put(url, data, config);
export const del = (url, config) => apiClient.delete(url, config);
export const patch = (url, data, config) => apiClient.patch(url, data, config);

export default apiClient;