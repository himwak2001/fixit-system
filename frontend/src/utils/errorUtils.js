/**
 * Extracts a human-readable message from any error type
 * thrown across the app — Axios errors, Zod errors, or
 * generic JS Error objects.
 *
 * Our axios.js interceptor already unwraps backend error
 * messages into err.message, so this is mostly a safety net
 * for cases that bypass that interceptor (e.g. S3 fetch calls).
 */
export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (!error) return fallback;

  // Already a clean string
  if (typeof error === "string") return error;

  // Standard Error object with a message
  if (error.message) return error.message;

  // Zod validation error array (rare — react-hook-form usually handles this)
  if (Array.isArray(error.issues)) {
    return error.issues.map((i) => i.message).join(", ");
  }

  return fallback;
}

/**
 * Standard toast config builder — keeps toast styling
 * consistent across the entire app without repeating
 * the same object in every component.
 */
export function buildToast({ title, description, status = "info" }) {
  return {
    title,
    description,
    status,
    duration: status === "error" ? 5000 : 4000,
    isClosable: true,
    position: "top-right",
  };
}
