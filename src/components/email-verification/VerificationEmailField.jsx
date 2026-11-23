export default function VerificationEmailField({
  registeredEmail,
  email,
  editEmail,
  maskedEmail,
  onEmailChange,
  onStartEditEmail,
  onFinishEditEmail,
}) {
  if (!editEmail) {
    return (
      <div className="bd-otp-address">
        <span className="bd-otp-masked-email">{maskedEmail}</span>

        <button
          className="bd-otp-text-button"
          type="button"
          onClick={onStartEditEmail}
        >
          Thay đổi email
        </button>
      </div>
    );
  }

  return (
    <div className="bd-reg-field">
      <label htmlFor="bd-otp-email" className="bd-reg-label">
        Email đăng ký
      </label>

      <input
        id="bd-otp-email"
        type="email"
        className="bd-reg-input"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        autoComplete="email"
        placeholder="ten@example.com"
        required
      />

      {registeredEmail && (
        <button
          type="button"
          className="bd-otp-text-button"
          onClick={onFinishEditEmail}
        >
          Xong
        </button>
      )}
    </div>
  );
}
