import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";

export const AuthContext = createContext();

// Uses the backend URL from the Vite environment variable
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

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

  const getHistoryOfUser = async () => {
    try {
      const request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });

      return request.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      const request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });

      return request.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        handleRegister,
        handleLogin,
        getHistoryOfUser,
        addToUserHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};