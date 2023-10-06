import axios from "axios";
import { url } from "../constants";

export function request({
  method,
  path,
  body = null,
  params = null,
  headers = null,
  responseType = null,
}) {
  console.log(body);
  return axios({
    method: method || "get",
    url: url + path,
    data: body,
    params: params,
    headers: headers,
    responseType: responseType,
  });
}
