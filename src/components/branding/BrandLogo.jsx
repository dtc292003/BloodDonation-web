
import { Link } from "react-router";
import logo from "../../assets/Logo.png";

function BrandLogo() {
  return (
    <Link
      to="/"
      className="inline-flex shrink-0 items-center"
      aria-label="BloodDonation - Trang chủ"
    >
      <img
        src={logo}
        alt="BloodDonation - Kết nối hiến máu"
        className="h-16 w-auto object-contain sm:h-20"
      />
    </Link>
  );
}

export default BrandLogo;
