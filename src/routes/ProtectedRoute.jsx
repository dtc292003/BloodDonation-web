
import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ allowedRoles }) {
  const {
    isAuthenticated,
    role,
    isRestoringSession,
  } = useAuth();

  const location = useLocation();

  // 1. Chờ khôi phục phiên khi F5
  if (isRestoringSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-600">
          Đang khôi phục phiên đăng nhập...
        </p>
      </div>
    );
  }

  // 2. Chưa đăng nhập hoặc phiên không hợp lệ
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 3. Đã đăng nhập nhưng không đúng quyền
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // 4. Đủ quyền truy cập
  return <Outlet />;
}

export default ProtectedRoute;
