import useLogin from "../../hooks/useLogin";

import LoginForm from "../../components/auth/LoginForm";
import RegisterLinks from "../../components/auth/RegisterLinks";

export default function LoginPage() {
  const login = useLogin();

  return (
    <>
      <LoginForm
        email={login.email}
        password={login.password}
        loading={login.loading}
        error={login.error}
        onEmailChange={login.changeEmail}
        onPasswordChange={login.changePassword}
        onSubmit={login.handleLogin}
      />

      <RegisterLinks />
    </>
  );
}
