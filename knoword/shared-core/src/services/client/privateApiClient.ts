import axios, { AxiosInstance } from "axios";
import { getBackendUrl } from "../../config";
import { logout } from "../auth/logout";

const privateApiClient: AxiosInstance = axios.create({
  baseURL: getBackendUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
    "User-Agent": "CustomClient",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

privateApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => privateApiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.get(`${getBackendUrl()}/auth/refresh-token`, {
          withCredentials: false,
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "User-Agent": "CustomClient",
          },
        });

        processQueue(null, "new-token");
        return privateApiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await logout(privateApiClient);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default privateApiClient;