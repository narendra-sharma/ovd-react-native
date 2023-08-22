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

export const apiSendForgotPasswordCode = async () => {
  const response = await request({
    path: "https://jsonplaceholder.typicode.com/todos/1",
  });
  return response;
};

export const apiResetPassword = async () => {
  const response = await request({
    path: "https://jsonplaceholder.typicode.com/todos/1",
  });
  return response;
};
