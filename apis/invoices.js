import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllInvoices = async (projectId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/view-all-invoices/${projectId}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetCreateInvoiceData = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/create-invoice`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiAddInvoice = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/add-invoice",
    method: "post",
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiGetUpdateInvoiceData = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: `auth/edit-invoice/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiUpdateInvoiceDetails = async (formData, id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "post",
    path: `auth/update-invoice/${id}`,
    body: formData,
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};

export const apiDeleteInvoice = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    method: "delete",
    path: `auth/delete-invoice/${id}`,
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
