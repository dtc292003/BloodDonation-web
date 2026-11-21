
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import authApi from "../../api/authApi";
import useAuth from "../../hooks/useAuth";

import FormInput from "../../components/common/FormInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import ErrorMessage from "../../components/common/ErrorMessage";

const ROLE_PATHS = {
  USER: "/user",
  MEDICAL: "/medical",
  ADMIN: "/admin",
};

function LoginPage() {
  const navigate = useNavigate();
  const { startSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const data = await authApi.login(
        email.trim(),
        password
      );

      const accessToken = data.accessToken;
      const role = data.role;

      if (!accessToken || !ROLE_PATHS[role]) {
        throw new Error(
          "Phản hồi đăng nhập không hợp lệ."
        );
      }

      startSession(accessToken, role);

      navigate(ROLE_PATHS[role], {
        replace: true,
      });

    } catch (err) {
      const serverMessage = err.response?.data?.message;

      if (typeof serverMessage === "string" && serverMessage) {
        setError(serverMessage);
      } else if (!err.response && err.isAxiosError) {
        setError(
          "Không kết nối được máy chủ. Vui lòng thử lại."
        );
      } else if (err.response?.status === 401) {
        setError(
          "Thông tin đăng nhập không hợp lệ hoặc tài khoản chưa được phép hoạt động."
        );
      } else {
        setError(
          err.message || "Đăng nhập thất bại. Vui lòng thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#263445]">
          Đăng nhập
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Chào mừng bạn quay trở lại BloodDonation.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <FormInput
          id="email"
          label="Địa chỉ email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          placeholder="Nhập email của bạn"
          autoComplete="username"
          required
          disabled={loading}
        />

        <div>
          <div className="mb-2 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#B4232D] hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <FormInput
            id="password"
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>

        {error && <ErrorMessage message={error} />}

        <PrimaryButton type="submit" loading={loading}>
          Đăng nhập
        </PrimaryButton>
      </form>

      <div className="mt-7 border-t border-[#E2E6EB] pt-6 text-center">
        <p className="text-sm text-slate-600">
          Bạn chưa có tài khoản?
        </p>

        <div className="mt-3 flex flex-col items-center gap-3">
          <Link
            to="/register"
            className="text-sm font-semibold text-[#B4232D] hover:underline"
          >
            Đăng ký người dùng
          </Link>

          <Link
            to="/register-medical"
            className="text-sm font-semibold text-[#B4232D] hover:underline"
          >
            Đăng ký đơn vị y tế
          </Link>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
