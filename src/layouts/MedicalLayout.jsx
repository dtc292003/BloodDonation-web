
import DashboardLayout from "./DashboardLayout";

const menuItems = [
  { label: "Tổng quan", path: "/medical" },
];

function MedicalLayout() {
  return (
    <DashboardLayout
      title="Quản lý đơn vị y tế"
      menuItems={menuItems}
    />
  );
}

export default MedicalLayout;
