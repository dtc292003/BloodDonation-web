import { Link } from "react-router";

const TABS = [
  {
    label: "Cá nhân",
    value: "USER",
    path: "/register",
  },
  {
    label: "Đơn vị y tế",
    value: "MEDICAL",
    path: "/register-medical",
  },
];

export default function RegistrationTabs({ active }) {
  return (
    <nav
      aria-label="Loại tài khoản"
      className="
        mb-[6.5px] flex w-full items-stretch
        border-b border-[#E2E6EB]
        max-[680px]:mb-[5.5px]
      "
    >
      {TABS.map((tab) => {
        const isActive = active === tab.value;

        return (
          <Link
            key={tab.value}
            to={tab.path}
            aria-current={isActive ? "page" : undefined}
            className={`
              -mb-px flex-1 border-b-2
              px-[2.5px] pt-[2.75px] pb-[0.75px]
              text-center text-sm font-[650]
              no-underline transition-colors
              duration-150 hover:text-[#B4232D]
              ${
                isActive
                  ? "border-[#B4232D] text-[#B4232D]"
                  : "border-transparent text-[#64748B]"
              }
            `}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
