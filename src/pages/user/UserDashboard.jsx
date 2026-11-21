
import { Link } from "react-router";

function UserDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        Dashboard USER
      </h2>

      <p className="mt-3 text-gray-600">
        Đăng nhập USER thành công.
      </p>

      <Link
        to="/admin"
        className="mt-5 inline-block rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
      >
        Kiểm thử truy cập ADMIN
      </Link>
    </div>
  );
}

export default UserDashboard;
