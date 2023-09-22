import { useEffect } from "react";
import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllTasks = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/view-all-tasks",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetTasksDropdownData = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/create-task",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiAddNewTask = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/add-task",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const apiGetPreFilledTaskDetails = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/edit-task/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateTaskDetails = async (formData, id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: `auth/update-task/${id}`,
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

// export const apiGetQuotationsByCompanyId = async (id) => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     path: `auth/get-quotation/${id}`,
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };

// export const apiDeleteProject = async (id) => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     method: "delete",
//     path: `auth/delete-project/${id}`,
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };