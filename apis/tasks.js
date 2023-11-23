import { useEffect } from "react";
import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllTasks = async (tagId = null, projectId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/view-all-tasks/${projectId}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
    params: {
      tag: tagId ? Number(tagId) : null,
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

export const apiDeleteTask = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "delete",
    path: `auth/delete-task/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiChangeDocApprovalStatus = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/document-approval/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiChangeDocumentStatus = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/document-status/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiChangeBeforeImageStatus = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/before-image/${id}`,
    method: "post",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiChangeAfterImageStatus = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/after-image/${id}`,
    method: "post",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

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
