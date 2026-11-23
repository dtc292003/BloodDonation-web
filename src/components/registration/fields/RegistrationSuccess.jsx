import { Link } from "react-router";

export default function RegistrationSuccess({ email, medical = false }) {
  return (
    <section
      className="flex flex-col items-start gap-3 py-[4.75px]"
      role="status"
    >
      <span
        className="material-symbols-outlined text-[40px] text-[#B4232D]"
        aria-hidden="true"
      >
        mark_email_read
      </span>

      <h2 className="text-[21px] font-bold text-[#263445]">
        Đã gửi mã xác minh
      </h2>

      <p className="text-[13px] leading-[1.65] text-[#64748B]">
        Tài khoản đã được tạo và hệ thống đã gửi OTP đến{" "}
        <strong className="break-all text-[#263445]">{email}</strong>.
      </p>

      <p className="text-[13px] leading-[1.65] text-[#64748B]">
        Vui lòng xác minh email để tiếp tục.
        {medical &&
          " Sau khi xác minh, đơn vị y tế mới vẫn cần được ADMIN phê duyệt."}
      </p>

      <p className="text-xs leading-[1.6] text-[#64748B]">
        Hãy kiểm tra hộp thư, kể cả thư mục Spam. Tài khoản cần hoàn tất xác
        minh email trước khi sử dụng.
      </p>

      <Link
        to="/login"
        className="mt-1 text-[13px] font-bold text-[#B4232D] hover:underline"
      >
        Quay về đăng nhập
      </Link>
    </section>
  );
}
