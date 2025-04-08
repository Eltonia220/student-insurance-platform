import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Required for HTTP-only cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle the new response format
    if (response.data && response.data.status === "success") {
      return response.data.data; // Return only the data payload
    }
    return response;
  },
  (error) => {
    // Handle errors consistently
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.statusText ||
        "Request failed";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

export default api;
