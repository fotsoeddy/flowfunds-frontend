import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://flowfunds-backend-ih3t.onrender.com/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Define auth methods and attach to the instance
const api = axiosInstance as any;

api.login = (data: any) => axiosInstance.post("/auth/login/", data);
api.register = (data: any) => axiosInstance.post("/auth/register/", data);
api.getProfile = () => axiosInstance.get("/auth/me/");
api.getAccounts = () => axiosInstance.get("/accounts/");
api.getTransactions = () => axiosInstance.get("/transactions/");
api.createTransaction = (data: any) => axiosInstance.post("/transactions/", data);

export default api;
