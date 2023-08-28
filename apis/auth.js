import { request } from "./index";

export const apiAuth = async (formData) => {
  // const response = await request({
  //   path: "https://jsonplaceholder.typicode.com/todos/1",
  // });
  const response = await request({
    path: "auth/login",
    method: "post",
    body: formData,
  });
  return response;
};

export const apiLogout = async (token) => {
  const response = await request({
    path: "auth/logout",
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const apiUpdateProfile = async (userData) => {
  console.log("at api ", userData);
  const response = await request({
    path: "auth/updateProfile",
    method: "post",
    body: userData,
  });
  return response;
};

export const apiGetProfileDetails = async () => {
  // console.log("At get profile");
  const response = await request({
    path: "auth/edit-profile",
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
  const response = await request({
    path: "auth/change-user-password",
    method: "post",
    body: formData,
  });
  return response;
};
