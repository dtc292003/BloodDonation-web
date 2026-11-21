
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

function LogoutButton() {
  const navigate = useNavigate();
  const { clearSession } = useAuth();

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Đăng xuất
    </button>
  );
}

export default LogoutButton;
