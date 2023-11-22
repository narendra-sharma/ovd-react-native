import { useEffect } from "react";
import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllProjects = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/view-all-projects",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetProjectsDropdownData = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/create-project",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetQuotationsByCompanyId = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/get-quotation/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiAddNewProject = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/add-project",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const apiGetPreFilledProjectDetails = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/edit-project/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateProjectDetails = async (formData, id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: `auth/update-project/${id}`,
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const apiDeleteProject = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "delete",
    path: `auth/delete-project/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiChangeProjectStatus = async (formData, id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: `auth/project-status-changed/${id}`,
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};
