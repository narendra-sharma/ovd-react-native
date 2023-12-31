import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllQuotes = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/view-all-quotes",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetQuoteDetails = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/edit-quotes/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetCreateQuoteDropdownData = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/create-quotes",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetConsultantsForQuotes = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/get-consultant-data/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiAddQuote = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/add-quotes",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateQuoteDetails = async (formData, id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: `auth/update-quotes/${id}`,
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiDeleteQuote = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "delete",
    path: `auth/delete-quotes/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiDownloadQuote = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/quotes-pdf/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
      responseType: "blob",
    },
  });
  return response;
};
