import { Outlet } from "react-router";
import Sidebar from "../components/navigation/Sidebar";
import LogoutButton from "../components/common/LogoutButton";

function DashboardLayout({ title, menuItems }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar title={title} menuItems={menuItems} />

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

          <LogoutButton />
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
