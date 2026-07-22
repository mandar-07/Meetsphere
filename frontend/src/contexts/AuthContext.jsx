import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";

export const AuthContext = createContext();

// Create axios instance with interceptor to inject JWT bearer token automatically
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useNavigate();

  // Persistent login: validate JWT token on mount and fetch user details
  useEffect(() => {
    const checkPersistentLogin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const request = await client.get("/profile");
          if (request.status === httpStatus.OK) {
            setUserData(request.data.user);
          }
        } catch (error) {
          console.error("Persistent login session expired or invalid:", error.message);
          localStorage.removeItem("token");
          setUserData(null);
        }
      }
      setLoading(false);
    };

    checkPersistentLogin();
  }, []);

  const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", {
        name,
        username,
        password,
      });

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const request = await client.post("/login", {
        username,
        password,
      });

      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user);
        router("/home");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    router("/auth");
  };

  const getHistoryOfUser = async () => {
    try {
      const request = await client.get("/get_all_activity");
      return request.data;
    } catch (error) {
      console.error("Failed fetching user history:", error.response?.data || error.message);
      throw error;
    }
  };

  const addToUserHistory = async (meetingCode, meetingName) => {
    try {
      const request = await client.post("/add_to_activity", {
        meeting_code: meetingCode,
        meeting_name: meetingName,
      });
      return request.data;
    } catch (error) {
      console.error("Failed adding to user history:", error.response?.data || error.message);
      throw error;
    }
  };

  const updateUserProfile = async (name, password, avatar) => {
    try {
      const request = await client.put("/update_profile", {
        name,
        password,
        avatar,
      });
      if (request.status === httpStatus.OK) {
        setUserData(request.data.user);
        return request.data.message;
      }
    } catch (error) {
      console.error("Failed updating user profile:", error.response?.data || error.message);
      throw error;
    }
  };

  const scheduleNewMeeting = async (meetingCode, meetingName, scheduledAt) => {
    try {
      const request = await client.post("/schedule_meeting", {
        meeting_code: meetingCode,
        meeting_name: meetingName,
        scheduled_at: scheduledAt,
      });
      return request.data;
    } catch (error) {
      console.error("Failed scheduling meeting:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
        getHistoryOfUser,
        addToUserHistory,
        updateUserProfile,
        scheduleNewMeeting,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};