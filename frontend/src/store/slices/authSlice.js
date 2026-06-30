import { createSlice } from "@reduxjs/toolkit";

/**
 * Auth status values:
 * 'initializing' — Keycloak.init() running
 * 'syncing'      — Calling backend /auth/sync
 * 'authenticated'— User fully loaded
 * 'unauthenticated' — No session
 * 'error'        — Something failed
 */
const initialState = {
  status: "initializing",
  profile: null, // { id, fullName, email, role, phone }
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitializing(state) {
      state.status = "initializing";
      state.error = null;
    },
    setSyncing(state) {
      state.status = "syncing";
      state.error = null;
    },
    setAuthenticated(state, action) {
      state.status = "authenticated";
      state.profile = action.payload; // user profile from backend
      state.error = null;
    },
    setUnauthenticated(state) {
      state.status = "unauthenticated";
      state.profile = null;
      state.error = null;
    },
    setError(state, action) {
      state.status = "error";
      state.error = action.payload;
    },
    clearAuth(state) {
      state.status = "unauthenticated";
      state.profile = null;
      state.error = null;
    },
  },
});

export const {
  setInitializing,
  setSyncing,
  setAuthenticated,
  setUnauthenticated,
  setError,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
