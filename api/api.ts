import axios from "axios";

const api = axios.create({
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export const url =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export default api;
