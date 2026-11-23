
import { Link } from "react-router";

import FormInput from "../common/FormInput";
import PrimaryButton from "../common/PrimaryButton";
import ErrorMessage from "../common/ErrorMessage";

export default function LoginForm({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
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

      <form onSubmit={onSubmit} className="space-y-5">
        <FormInput
          id="email"
          label="Địa chỉ email"
          type="email"
          value={email}
          onChange={(event) =>
            onEmailChange(event.target.value)
          }
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
            onChange={(event) =>
              onPasswordChange(event.target.value)
            }
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
    </>
  );
}
