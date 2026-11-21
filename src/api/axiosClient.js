
import axios from "axios";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {

  if (
    accessToken &&
    !config.url?.startsWith("/auth/")
  ) {
    config.headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  return config;
});

export default axiosClient;
