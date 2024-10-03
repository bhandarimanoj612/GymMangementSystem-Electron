import axios from "axios";

export const clientName = "NutriHub";
export const clientAddress = "Itahari-20, Tarahara, Nepal";

export const base_url = "http://localhost:9000/api/";
export const axios_no_auth = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const axios_auth = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export const axios_auth_form = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});
 export const NepaliTime = () => {
   const options = { timeZone: "Asia/Kathmandu" };
   return new Date().toLocaleString("en-US", options).split(",")[1];
 };