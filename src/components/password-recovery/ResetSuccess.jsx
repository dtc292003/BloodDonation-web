
import { Link } from "react-router";

export default function ResetSuccess() {
  return (
    <>
      <h1 className="bd-reg-title">
        Đổi mật khẩu thành công!
      </h1>

      <p className="bd-reg-subtitle">
        Mật khẩu tài khoản đã được cập nhật.
        Bạn có thể đăng nhập bằng mật khẩu mới.
      </p>

      <Link to="/login" className="bd-reg-submit">
        Đến trang đăng nhập
      </Link>
    </>
  );
}
