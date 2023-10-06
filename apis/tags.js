import { useEffect } from "react";
import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllTags = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/view-all-tags",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiAddNewTag = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/add-tag",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetPreFilledTagDetails = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/edit-tag/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateTagDetails = async (formData, id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: `auth/update-tag/${id}`,
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiDeleteTag = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "delete",
    path: `auth/delete-tag/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

// export const apiGetTasksDropdownData = async () => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     path: "auth/create-task",
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };

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
