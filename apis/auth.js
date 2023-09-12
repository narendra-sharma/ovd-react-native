import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiAuth = async (formData) => {
  const response = await request({
    path: "auth/login",
    method: "post",
    body: formData,
  });
  return response;
};

export const apiLogout = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/logout",
    method: "post",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateProfile = async (userData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/updateProfile",
    method: "post",
    body: userData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetProfileDetails = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/edit-profile",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiSendForgotPasswordCode = async (formData) => {
  const response = await request({
    path: "auth/reset-password",
    method: "post",
    body: formData,
  });
  return response;
};

export const apiVerifyOtp = async (formData) => {
  const response = await request({
    path: "auth/check-otp",
    method: "post",
    body: formData,
  });
  return response;
};

export const apiResetPassword = async (formData) => {
  const response = await request({
    path: "auth/change-password",
    method: "post",
    body: formData,
  });
  return response;
};

export const apiChangePasswordFromDashboard = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/change-user-password",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};
