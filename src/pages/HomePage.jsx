
import { Link } from "react-router";

function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-6">
      <h1 className="text-4xl font-bold text-red-600">
        BloodDonation
      </h1>

      <p className="mt-3 text-gray-600">
        Hệ thống quản lý và hỗ trợ kết nối hiến máu
      </p>

      <Link
        to="/login"
        className="mt-6 rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
      >
        Đăng nhập
      </Link>
    </main>
  );
}

export default HomePage;
