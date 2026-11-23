
export default function FormNotice({
  variant = "error",
  children,
}) {
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`
        rounded-[7px] border
        px-[3.5px] py-3
        text-[13px] leading-[1.6]
        ${
          isError
            ? "border-[#F3CED1] bg-[#FFF7F7] text-[#96252B]"
            : "border-[#C9E8D5] bg-[#F3FAF5] text-[#256341]"
        }
      `}
    >
      {children}
    </div>
  );
}
