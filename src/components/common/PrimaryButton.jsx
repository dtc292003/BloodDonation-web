
function PrimaryButton({
  children,
  type = "button",
  loading = false,
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className="flex h-11 w-full items-center justify-center rounded-md bg-[#B4232D] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#941D27] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B4232D] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Đang đăng nhập..." : children}
    </button>
  );
}

export default PrimaryButton;
