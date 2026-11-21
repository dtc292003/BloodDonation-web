
import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { setAccessToken } from "../api/axiosClient";

function AuthProvider({ children }) {

  const [session, setSession] = useState({
    accessToken: null,
    role: null,
  });

  const startSession = useCallback((accessToken, role) => {

    if (
      !accessToken ||
      !["USER", "MEDICAL", "ADMIN"].includes(role)
    ) {
      throw new Error("Thông tin đăng nhập không hợp lệ");
    }

    setAccessToken(accessToken);

    setSession({
      accessToken,
      role,
    });
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);

    setSession({
      accessToken: null,
      role: null,
    });
  }, []);

  const value = useMemo(() => ({
    ...session,
    isAuthenticated: Boolean(session.accessToken),
    startSession,
    clearSession,
  }), [session, startSession, clearSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
