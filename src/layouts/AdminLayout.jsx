
import DashboardLayout from "./DashboardLayout";

const menuItems = [
  { label: "Tổng quan", path: "/admin" },
];

function AdminLayout() {
  return (
    <DashboardLayout
      title="Quản trị hệ thống"
      menuItems={menuItems}
    />
  );
}

export default AdminLayout;
