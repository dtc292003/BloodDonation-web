import { useState } from "react";
import { useNavigate } from "react-router";

import authApi from "../api/authApi";
import useAuth from "./useAuth";

const ROLE_PATHS = {
  USER: "/user",
  MEDICAL: "/medical",
  ADMIN: "/admin",
};

export default function useLogin() {
  const navigate = useNavigate();
  const { startSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cập nhật email
  const changeEmail = (value) => {
    setEmail(value);
    setError("");
  };

  // Cập nhật mật khẩu
  const changePassword = (value) => {
    setPassword(value);
    setError("");
  };

  // Xử lý đăng nhập
  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const data = await authApi.login(email.trim(), password);

      // Nhận thông tin phiên từ Backend
      const { accessToken, refreshToken, role } = data;

      // Kiểm tra dữ liệu đăng nhập
      if (!accessToken || !refreshToken || !ROLE_PATHS[role]) {
        throw new Error("Phản hồi đăng nhập không hợp lệ.");
      }

      // Khởi tạo phiên đăng nhập
      startSession(accessToken, role, refreshToken);

      // Điều hướng theo Role
      navigate(ROLE_PATHS[role], {
        replace: true,
      });
    } catch (err) {
      const serverMessage = err.response?.data?.message;

      if (typeof serverMessage === "string" && serverMessage) {
        setError(serverMessage);
      } else if (!err.response && err.isAxiosError) {
        setError("Không kết nối được máy chủ. Vui lòng thử lại.");
      } else if (err.response?.status === 401) {
        setError(
          "Thông tin đăng nhập không hợp lệ hoặc " +
            "tài khoản chưa được phép hoạt động.",
        );
      } else {
        setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    loading,
    error,
    changeEmail,
    changePassword,
    handleLogin,
  };
}
