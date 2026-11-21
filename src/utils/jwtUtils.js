
export function getRoleFromToken(token) {
  try {
    const payload = token.split(".")[1];

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = JSON.parse(atob(normalized));

    return decoded.role ?? null;
  } catch {
    return null;
  }
}
