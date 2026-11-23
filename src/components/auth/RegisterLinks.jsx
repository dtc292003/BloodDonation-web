import { Link } from "react-router";

export default function RegisterLinks() {
  return (
    <div className="mt-7 border-t border-[#E2E6EB] pt-6 text-center">
      <p className="text-sm text-slate-600">Bạn chưa có tài khoản?</p>

      <div className="mt-3 flex flex-col items-center gap-3">
        <Link
          to="/register"
          className="text-sm font-semibold text-[#B4232D] hover:underline"
        >
          Đăng ký người dùng
        </Link>

        <Link
          to="/register-medical"
          className="text-sm font-semibold text-[#B4232D] hover:underline"
        >
          Đăng ký đơn vị y tế
        </Link>
      </div>
    </div>
  );
}
