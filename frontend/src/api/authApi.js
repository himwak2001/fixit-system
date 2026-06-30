import api from "./axios";

/**
 * Calls POST /auth/sync
 * Creates the user in our DB on first login, returns their profile on subsequent ones.
 * @returns {Promise<{id, fullName, email, role, phone}>}
 */
export const syncUser = async () => {
  const response = await api.post("/auth/sync");
  return response.data; // response is ApiResponse, .data is the user profile
};

/**
 * Calls GET /auth/me
 * Returns the current user's profile from DB.
 * @returns {Promise<{id, fullName, email, role, phone}>}
 */
export const getMyProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
