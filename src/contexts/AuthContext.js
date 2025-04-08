import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Debugging: Log the environment and API base URL
console.log("Environment:", process.env.NODE_ENV);
console.log(
  "API Base URL:",
  import.meta.env.VITE_API_URL || "http://localhost:3001/api",
);

// Configure Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create Auth Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider mounted"); // Debugging: Log when AuthProvider is mounted

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        console.log("Response Interceptor - Success:", response); // Debugging
        return response;
      },
      (error) => {
        console.error("Response Interceptor - Error:", error); // Debugging
        if (error.response?.status === 401) {
          console.log("Unauthorized - Navigating to login"); // Debugging
          setCurrentUser(null);
          localStorage.removeItem("token");
          navigate("/login");
        }
        return Promise.reject(error);
      },
    );

    return () => {
      console.log("Removing response interceptor"); // Debugging
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  useEffect(() => {
    console.log("Verifying authentication"); // Debugging: Log when verifyAuth is called

    const verifyAuth = async () => {
      try {
        const { data } = await api.get("/auth/verify");
        console.log("Verify Authentication - Success:", data); // Debugging
        setCurrentUser(data.user);
      } catch (err) {
        console.error("Verify Authentication - Error:", err); // Debugging
        setCurrentUser(null);
        if (err.response?.status !== 401) {
          console.error("Auth verification unexpected error:", err); // Debugging
        }
      } finally {
        console.log("Authentication verification complete"); // Debugging
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    setError(null);
    console.log("Logging in with credentials:", credentials); // Debugging

    try {
      const { data } = await api.post("/auth/login", credentials);
      console.log("Login Success:", data); // Debugging
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      console.error("Login Error:", err); // Debugging
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    setError(null);
    console.log("Registering user:", userData); // Debugging

    try {
      const { data } = await api.post("/auth/register", userData);
      console.log("Registration Success:", data); // Debugging
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      console.error("Registration Error:", err); // Debugging
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    console.log("Logging out user"); // Debugging

    try {
      await api.post("/auth/logout");
      console.log("Logout Success"); // Debugging
    } catch (err) {
      console.error("Logout Error:", err); // Debugging
    } finally {
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-blue-600">Loading...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  console.log("useAuth called"); // Debugging: Log when useAuth is used

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
