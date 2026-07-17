import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status"; 

export const AuthContext = createContext();

const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    try {
      let request = await client.post("/register", {
        name,
        username,
        password,
      });

      if (request.status === httpStatus.CREATED) {
        // 201 Created
        return request.data.message;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username,
        password,
      });

      if (request.status === httpStatus.OK) {
        // 200 OK
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user);
        router("/home"); // ✅ Same as YouTube version
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const getHistoryOfUser=async()=>{
    try{
      let request=await client.get("/get_all_activity",{
        params:{
          token:localStorage.getItem("token")
        }
      });
      return request.data;
    }catch(e){
      throw e;
    }
  }

  const addToUserHistory=async(meetingCode)=>{
    try{
      let request=await client.post("/add_to_activity",{
         token:localStorage.getItem("token"),
         meeting_code:meetingCode
      });
      return request
    }catch(e){
      throw e;
    }
  }

  const data = {
    userData,
    setUserData,
    addToUserHistory,
    getHistoryOfUser,
    handleRegister,
    handleLogin,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};