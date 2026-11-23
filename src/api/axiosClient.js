import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

const REFRESH_TOKEN_KEY = "bd_refresh_token";

let accessToken = null;
let refreshPromise = null;
let authCallbacks = null;

export function setAccessToken(token) {
  accessToken = token;
}

// Kết nối axiosClient với AuthProvider
export function registerAuthCallbacks(callbacks) {
  authCallbacks = callbacks;

  return () => {
    if (authCallbacks === callbacks) {
      authCallbacks = null;
    }
  };
}

// Chỉ xóa đúng phiên đang gặp lỗi
function expireSession(expectedRefreshToken) {
  if (sessionStorage.getItem(REFRESH_TOKEN_KEY) !== expectedRefreshToken) {
    return;
  }

  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  setAccessToken(null);

  // Thông báo AuthProvider xóa trạng thái đăng nhập
  authCallbacks?.onSessionExpired?.();
}

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// 1. REQUEST INTERCEPTOR
// ================================

axiosClient.interceptors.request.use((config) => {
  if (accessToken && !config.url?.startsWith("/auth/")) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

// ================================
// 2. REFRESH ACCESS TOKEN
// ================================

function refreshAccessToken(savedRefreshToken) {
  return axios
    .post(
      `${BASE_URL}/auth/refresh`,
      {
        refreshToken: savedRefreshToken,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    .then(({ data }) => {
      // Không phục hồi phiên đã Logout hoặc bị thay thế
      if (sessionStorage.getItem(REFRESH_TOKEN_KEY) !== savedRefreshToken) {
        throw new Error("Phiên đăng nhập đã thay đổi.");
      }

      const validRoles = ["USER", "MEDICAL", "ADMIN"];

      if (!data?.accessToken || !validRoles.includes(data.role)) {
        expireSession(savedRefreshToken);

        throw new Error("Phản hồi Refresh Token không hợp lệ.");
      }

      // Cập nhật Refresh Token nếu Backend xoay vòng
      const nextRefreshToken = data.refreshToken || savedRefreshToken;

      sessionStorage.setItem(REFRESH_TOKEN_KEY, nextRefreshToken);

      // Cập nhật Access Token trong Axios
      setAccessToken(data.accessToken);

      // Đồng bộ Access Token và Role với AuthContext
      authCallbacks?.onTokenRefreshed?.({
        accessToken: data.accessToken,
        role: data.role,
      });

      return data.accessToken;
    })
    .catch((error) => {
      const status = error.response?.status;

      // Backend xác nhận Refresh Token không hợp lệ
      if ([400, 401, 403].includes(status)) {
        expireSession(savedRefreshToken);
      }

      // Lỗi mạng hoặc 5xx không tự xóa Refresh Token
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });
}

// ================================
// 3. RESPONSE INTERCEPTOR
// ================================

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.startsWith("/auth/")
    ) {
      return Promise.reject(error);
    }

    // Chỉ Refresh request đã gửi Bearer Token
    const previousAuthorization =
      originalRequest.headers?.get?.("Authorization");

    if (
      typeof previousAuthorization !== "string" ||
      !previousAuthorization.startsWith("Bearer ")
    ) {
      return Promise.reject(error);
    }

    const savedRefreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);

    if (!savedRefreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Request khác đã Refresh trước đó
      if (accessToken && previousAuthorization !== `Bearer ${accessToken}`) {
        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);

        return axiosClient(originalRequest);
      }

      // Các request đồng thời dùng chung một lần Refresh
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken(savedRefreshToken);
      }

      const newAccessToken = await refreshPromise;

      // Gửi lại API ban đầu
      originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);

      return axiosClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default axiosClient;
