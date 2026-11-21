
function GoogleIcon({
  name,
  size = 20,
  className = "",
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default GoogleIcon;
