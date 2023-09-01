import { request } from "./index";

export const apiGetAllCompanies = async () => {
  const response = await request({
    path: "auth/view-all-companies",
  });
  return response;
};

export const apiCreateNewCompany = async (formData) => {
  // console.log("at api: ", formData);
  const response = await request({
    method: "post",
    path: "auth/create-company",
    body: formData,
  });
  return response;
};

export const apiGetCompanyDetails = async (id) => {
  const response = await request({
    path: `auth/edit-company/${id}`,
  });
  return response;
};

export const apiDeleteCompany = async (id) => {
  const response = await request({
    method: "delete",
    path: `auth/delete-company/${id}`,
  });
  return response;
};

export const apiUpdateCompanyDetails = async (formData, id) => {
  const response = await request({
    method: "post",
    path: `auth/update-company/${id}`,
    body: formData,
  });
  return response;
};

export const apiGetAllUsers = async () => {
  const response = await request({
    path: "auth/get-all-users",
  });
  return response;
};
