
function LoadingSpinner({ message = "Đang tải dữ liệu..." }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 p-6"
    >
      <div
        className="h-6 w-6 animate-spin rounded-full border-4 border-red-100 border-t-red-600"
        aria-hidden="true"
      />

      <span className="text-sm text-gray-600">
        {message}
      </span>
    </div>
  );
}

export default LoadingSpinner;
