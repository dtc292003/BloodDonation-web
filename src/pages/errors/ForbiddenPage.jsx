
import { Link } from "react-router";

function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <h1 className="text-5xl font-bold text-red-600">
        403
      </h1>

      <h2 className="mt-4 text-xl font-semibold text-slate-900">
        Không có quyền truy cập
      </h2>

      <p className="mt-2 text-center text-slate-600">
        Tài khoản của bạn không được phép truy cập trang này.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
      >
        Quay về trang chủ
      </Link>
    </main>
  );
}

export default ForbiddenPage;
