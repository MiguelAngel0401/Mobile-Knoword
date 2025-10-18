import axios from "axios";

const publicApiClient = axios.create({
  baseURL: "https://unpleading-lawfully-coy.ngrok-free.dev",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
  timeout: 15000,
});

publicApiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default publicApiClient;