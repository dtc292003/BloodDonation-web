
import DashboardLayout from "./DashboardLayout";

const menuItems = [
  { label: "Tổng quan", path: "/user" },
];

function UserLayout() {
  return (
    <DashboardLayout
      title="Trang người dùng"
      menuItems={menuItems}
    />
  );
}

export default UserLayout;
