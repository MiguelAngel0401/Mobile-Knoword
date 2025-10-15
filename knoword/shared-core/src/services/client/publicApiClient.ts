import axios from "axios";
import { getBackendUrl } from "../../config";

const publicApiClient = axios.create({
  baseURL: getBackendUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Log de peticiones (request)
publicApiClient.interceptors.request.use(
  (config) => {
    const url = `${config.baseURL || ''}${config.url || ''}`;
    console.log("🌐 Petición a:", url);
    console.log("📤 Método:", config.method?.toUpperCase());
    console.log("📦 Params:", config.params);
    console.log("📦 Data:", config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Log de respuestas (response)
publicApiClient.interceptors.response.use(
  (response) => {
    console.log("✅ Respuesta exitosa de:", response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Error en solicitud pública:", error.message);
    console.error("❌ URL:", error.config?.url || 'URL desconocida');
    console.error("❌ Método:", error.config?.method?.toUpperCase() || 'MÉTODO desconocido');
    console.error("❌ Params enviados:", error.config?.params);
    console.error("❌ Data enviada:", error.config?.data);
    console.error("❌ Status:", error.response?.status);
    console.error("❌ Respuesta del servidor:", JSON.stringify(error.response?.data, null, 2));
    return Promise.reject(error);
  },
);

export default publicApiClient;