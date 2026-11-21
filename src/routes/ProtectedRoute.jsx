
import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ allowedRoles }) {

  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Đã đăng nhập nhưng không đúng quyền
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // Đủ quyền mới hiển thị Layout và Page
  return <Outlet />;
}

export default ProtectedRoute;
