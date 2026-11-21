
import { Link, Outlet } from "react-router";
import BrandLogo from "../components/branding/BrandLogo";

const features = [
  {
    title: "Kết nối người hiến và người cần máu",
    description:
      "Hỗ trợ tìm kiếm và kết nối theo nhu cầu.",
  },
  {
    title: "Đăng ký sự kiện hiến máu",
    description:
      "Theo dõi thông tin và lịch tham gia.",
  },
  {
    title: "Hỗ trợ đơn vị y tế",
    description:
      "Quản lý các hoạt động hiến máu thuận tiện.",
  },
];

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">

      {/* Header */}
      <header className="border-b border-[#E2E6EB] bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 lg:px-8">
          <BrandLogo />

          <Link
            to="/"
            className="text-sm font-medium text-[#263445] transition-colors hover:text-[#B4232D]"
          >
            Trang chủ
          </Link>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-10 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">

          {/* Cột trái */}
          <section className="hidden lg:block">

            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#B4232D]">
              BloodDonation
            </p>

            <h1 className="max-w-lg text-4xl font-bold leading-tight text-[#263445]">
              Trao giọt máu hồng
              <span className="mt-2 block text-[#B4232D]">
                Kết nối sự sống.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600">
              Nền tảng hỗ trợ kết nối cộng đồng hiến máu,
              giúp người dân tham gia các hoạt động hiến máu
              và hỗ trợ đơn vị y tế trong công tác quản lý.
            </p>

            {/* Danh sách tính năng, không dùng icon trang trí */}
            <div className="mt-10 space-y-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="border-l-2 border-[#E2E6EB] pl-4"
                >
                  <h2 className="font-semibold text-[#263445]">
                    {feature.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

          </section>

          {/* Cột phải */}
          <section className="w-full rounded-lg border border-[#E2E6EB] bg-white p-6 shadow-sm sm:p-9">
            <Outlet />
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E6EB] px-5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} BloodDonation.
        Hệ thống quản lý và hỗ trợ kết nối hiến máu.
      </footer>

    </div>
  );
}

export default AuthLayout;
