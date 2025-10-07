import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response || {};

    // Do not hard-redirect on 401 here; let callers decide how to handle it

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || (status === 401 ? "UNAUTHORIZED" : "UNKNOWN_ERROR"),
    };

    return Promise.reject(customError);
  }
);

export default API;
