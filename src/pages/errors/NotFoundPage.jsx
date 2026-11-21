
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <h1 className="text-6xl font-bold text-red-600">
        404
      </h1>

      <p className="mt-4 text-gray-600">
        Trang bạn tìm kiếm không tồn tại.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
      >
        Về trang chủ
      </Link>
    </main>
  );
}

export default NotFoundPage;
