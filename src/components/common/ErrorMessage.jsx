
function ErrorMessage({
  message = "Đã xảy ra lỗi. Vui lòng thử lại.",
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

export default ErrorMessage;
