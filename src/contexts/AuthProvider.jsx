import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AuthContext } from "./AuthContext";

import { setAccessToken, registerAuthCallbacks } from "../api/axiosClient";

import authApi from "../api/authApi";

const REFRESH_TOKEN_KEY = "bd_refresh_token";
const VALID_ROLES = ["USER", "MEDICAL", "ADMIN"];

function AuthProvider({ children }) {
  const [session, setSession] = useState({
    accessToken: null,
    role: null,
  });

  const [isRestoringSession, setIsRestoringSession] = useState(() =>
    Boolean(sessionStorage.getItem(REFRESH_TOKEN_KEY)),
  );

  const restorePromiseRef = useRef(null);
  const sessionRevisionRef = useRef(0);

  // ==============================
  // 1. BẮT ĐẦU PHIÊN
  // ==============================

  const startSession = useCallback((accessToken, role, refreshToken) => {
    if (
      !accessToken ||
      !VALID_ROLES.includes(role) ||
      typeof refreshToken !== "string" ||
      !refreshToken.trim()
    ) {
      throw new Error("Thông tin đăng nhập không hợp lệ");
    }

    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    sessionRevisionRef.current += 1;

    setAccessToken(accessToken);

    setSession({
      accessToken,
      role,
    });

    setIsRestoringSession(false);
  }, []);

  // ==============================
  // 2. XÓA PHIÊN
  // ==============================

  const clearSession = useCallback(() => {
    sessionRevisionRef.current += 1;

    sessionStorage.removeItem(REFRESH_TOKEN_KEY);

    setAccessToken(null);

    setSession({
      accessToken: null,
      role: null,
    });

    setIsRestoringSession(false);
  }, []);

  // ==============================
  // 3. ĐỒNG BỘ TOKEN SAU REFRESH
  // ==============================

  const syncRefreshedSession = useCallback(({ accessToken, role }) => {
    if (!accessToken || !VALID_ROLES.includes(role)) {
      return;
    }

    setSession((current) => {
      // Không khôi phục phiên đã Logout
      if (!current.accessToken) {
        return current;
      }

      return {
        accessToken,
        role,
      };
    });
  }, []);

  // ==============================
  // 4. ĐĂNG KÝ CALLBACK VỚI AXIOS
  // ==============================

  useEffect(() => {
    return registerAuthCallbacks({
      onTokenRefreshed: syncRefreshedSession,
      onSessionExpired: clearSession,
    });
  }, [syncRefreshedSession, clearSession]);

  // ==============================
  // 5. KHÔI PHỤC PHIÊN KHI F5
  // ==============================

  useEffect(() => {
    let active = true;

    const savedRefreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);

    if (!savedRefreshToken) {
      return () => {
        active = false;
      };
    }

    const revision = sessionRevisionRef.current;

    if (!restorePromiseRef.current) {
      restorePromiseRef.current = authApi.refresh(savedRefreshToken);
    }

    restorePromiseRef.current
      .then((data) => {
        if (!active || revision !== sessionRevisionRef.current) {
          return;
        }

        startSession(
          data.accessToken,
          data.role,
          data.refreshToken || savedRefreshToken,
        );
      })
      .catch((error) => {
        if (!active || revision !== sessionRevisionRef.current) {
          return;
        }

        // Token hết hạn hoặc bị thu hồi
        if ([400, 401, 403].includes(error.response?.status)) {
          clearSession();
        } else {
          // Lỗi mạng: giữ Refresh Token để có thể thử lại
          setIsRestoringSession(false);
        }
      })
      .finally(() => {
        if (active && revision === sessionRevisionRef.current) {
          setIsRestoringSession(false);
        }
      });

    return () => {
      active = false;
    };
  }, [startSession, clearSession]);

  // ==============================
  // 6. AUTH CONTEXT
  // ==============================

  const value = useMemo(
    () => ({
      ...session,

      isAuthenticated: Boolean(session.accessToken),

      isRestoringSession,

      startSession,
      clearSession,
    }),
    [session, isRestoringSession, startSession, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
