/**
 * Extracts initials from a full name.
 * "Priya Sharma"  → "PS"
 * "Ramesh Kumar"  → "RK"
 * "Admin"         → "A"
 * null/undefined  → "?"
 */
export function getInitials(fullName) {
  if (!fullName || typeof fullName !== "string") return "?";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();

  // First character of first word + first character of last word
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
