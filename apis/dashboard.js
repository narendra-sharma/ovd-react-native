import { useEffect } from "react";
import { request } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetAllDashboardData = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await request({
    path: "auth/dashboard",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  });
  return response;
};
