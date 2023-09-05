import { request } from "./index";

export const apiGetAllQuotes = async () => {
  const response = await request({
    path: "auth/view-all-quotes",
  });
  return response;
};

export const apiGetQuoteDetails = async (id) => {
  const response = await request({
    path: `auth/edit-quotes/${id}`,
  });
  return response;
};

export const apiAddQuote = async (formData) => {
  const response = await request({
    path: "auth/add-quotes",
    method: "post",
    body: formData,
  });
  return response;
};

export const apiUpdateQuoteDetails = async (formData, id) => {
  const response = await request({
    method: "post",
    path: `auth/update-quotes/${id}`,
    body: formData,
  });
  return response;
};

export const apiDeleteQuote = async (id) => {
  const response = await request({
    method: "delete",
    path: `auth/delete-quotes/${id}`,
  });
  return response;
};
