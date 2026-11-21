import { Routes, Route } from "react-router";

// Public Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import MedicalRegisterPage from "../pages/auth/MedicalRegisterPage";

import ForbiddenPage from "../pages/errors/ForbiddenPage";
import NotFoundPage from "../pages/errors/NotFoundPage";

// Authentication Layout
import AuthLayout from "../layouts/AuthLayout";

// Protected Routes
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import UserLayout from "../layouts/UserLayout";
import MedicalLayout from "../layouts/MedicalLayout";
import AdminLayout from "../layouts/AdminLayout";

// Dashboards
import UserDashboard from "../pages/user/UserDashboard";
import MedicalDashboard from "../pages/medical/MedicalDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

//Verify Email Page
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Trang công khai */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-medical" element={<MedicalRegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* 3. Trang lỗi phân quyền */}
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* 4. USER */}
      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
        </Route>
      </Route>

      {/* 5. MEDICAL */}
      <Route element={<ProtectedRoute allowedRoles={["MEDICAL"]} />}>
        <Route path="/medical" element={<MedicalLayout />}>
          <Route index element={<MedicalDashboard />} />
        </Route>
      </Route>

      {/* 6. ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* 7. Trang không tồn tại */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
