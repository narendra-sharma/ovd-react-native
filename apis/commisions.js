import { useEffect } from "react";
import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllCommissions = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/all-commission-details",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetCommissionDetails = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/view-detail/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

// export const apiGetPreFilledTagDetails = async (id) => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     path: `auth/edit-tag/${id}`,
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };

// export const apiUpdateTagDetails = async (formData, id) => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     method: "post",
//     path: `auth/update-tag/${id}`,
//     body: formData,
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };

// export const apiDeleteTag = async (id) => {
//   const token = await AsyncStorage.getItem("token");
//   const response = await request({
//     method: "delete",
//     path: `auth/delete-tag/${id}`,
//     headers: {
//       Authorization: `Bearer ${JSON.parse(token)}`,
//     },
//   });
//   return response;
// };
