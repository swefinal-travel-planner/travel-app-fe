import axios from "axios";

const api = axios.create({
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Log request before sending
api.interceptors.request.use(
  (config) => {
    console.log("Sending Request:", {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

export const url =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export default api;
