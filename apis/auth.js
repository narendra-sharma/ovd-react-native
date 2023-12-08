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

// export const checktoken = async (latesttoken,navigation) => {
//     console.log("Latest Token",latesttoken)
//     const storedtoken = await AsyncStorage.getItem("token");
//     if (storedtoken !== latesttoken){
//       await AsyncStorage.removeItem("profile")
//       await navigation.navigate("Login")
//     }
// }

export const handlererrors = async (codeissue, navigation) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (codeissue.message === "Request failed with status code 401" || codeissue.response.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("profile");
      navigation.navigate("Login");
      console.log("My Error Status", codeissue.response.status)
    } else {
      console.log("My Error Status", codeissue.response.status);
      console.log("My Error Data", codeissue.response.data);
    }
  } catch (gettingerror) {
    console.error("Error handling failed:", gettingerror);
  }
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
