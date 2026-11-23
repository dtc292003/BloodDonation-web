export const OTP_LENGTH = 6;

export function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function maskEmail(email) {
  const parts = email.split("@");

  if (parts.length !== 2) return email;

  const [name, domain] = parts;

  return `${name.slice(0, Math.min(3, name.length))}***@${domain}`;
}
