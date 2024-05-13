import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
// import { userToken } from 'utils'

export interface ApiErrorData {
  message: string;
}

// Create a map to store the AbortController instances
const abortControllers = new Map<string, AbortController>();

// Create a function to generate a unique token for each request
const generateRequestToken = (config: InternalAxiosRequestConfig) => {
  const { method, url, params, data } = config;
  return `${String(method)}-${String(url)}-${JSON.stringify(
    params
  )}-${JSON.stringify(data)}`;
};

// Create instance of axios
const formhttp = axios.create({
  baseURL: "http://192.168.68.93:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

// Create a request interceptor for the instance and get accessToken
formhttp.interceptors.request.use(
  async (config) => {
    // Attach an AbortController to the request
    const requestToken = generateRequestToken(config);
    const abortController = new AbortController();
    abortControllers.set(requestToken, abortController);
    config.signal = abortController.signal;

    // Set timeout for the request
    // config.timeout = 5000

    // Set Authorization header
    const data = localStorage.getItem("driver") || null;
    const token = data && JSON.parse(data || "");
    config.headers.Authorization = `Bearer ${token.token} `;
    // console.log(token.token);
    // console.log(config.headers)
    return config;
  },
  async (error) => {
    console.log("Global Error 2", error);
    return await Promise.reject(error);
  }
);

formhttp.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorData>) => {
    if (axios.isAxiosError(error) && error.response) {
      if (error?.response.status === 401 || error?.response?.status === 500) {
        // localStorage.clear()
        // window.location.reload()
        return "";
      }
      throw error;
    }
  }
);

// Create a function to cancel a request using the associated AbortController
export const cancelRequest = (config: InternalAxiosRequestConfig) => {
  const requestToken = generateRequestToken(config);
  const abortController = abortControllers.get(requestToken);
  if (abortController) {
    abortController.abort();
    abortControllers.delete(requestToken);
  }
};

export default formhttp;
