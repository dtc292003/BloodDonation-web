
import { Link } from "react-router";

function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        Dashboard ADMIN
      </h2>

      <p className="mt-3 text-gray-600">
        Đăng nhập với quyền ADMIN thành công.
      </p>

      <Link
        to="/medical"
        className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
      >
        Kiểm thử truy cập MEDICAL
      </Link>
    </div>
  );
}

export default AdminDashboard;
