
import { NavLink } from "react-router";

function Sidebar({ title, menuItems }) {
  return (
    <aside className="w-full border-b border-gray-200 bg-white lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0">
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-xl font-bold text-red-600">
          BloodDonation
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {title}
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-red-50 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
