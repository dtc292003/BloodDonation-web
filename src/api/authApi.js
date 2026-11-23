import axiosClient from "./axiosClient";

const authApi = {
  // 1. Đăng nhập
  login: async (email, password) => {
    const response = await axiosClient.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  },

  // 2. Làm mới phiên đăng nhập
  refresh: async (refreshToken) => {
    if (!refreshToken || typeof refreshToken !== "string") {
      throw new Error("Refresh Token không hợp lệ.");
    }

    const response = await axiosClient.post("/auth/refresh", {
      refreshToken,
    });

    return response.data;
  },

  // 3. Đăng xuất và thu hồi Refresh Token
  logout: async (refreshToken) => {
    if (!refreshToken || typeof refreshToken !== "string") {
      throw new Error("Refresh Token không hợp lệ.");
    }

    const response = await axiosClient.post("/auth/logout", {
      refreshToken,
    });

    return response.data;
  },
};

export default authApi;
