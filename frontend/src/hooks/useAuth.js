import { useSelector } from "react-redux";
import { useCallback } from "react";
import keycloak from "../auth/keycloak";
import { ROLE_HOME } from "../utils/constants";

function useAuth() {
  const { status, profile, error } = useSelector((state) => state.auth);

  const login = useCallback(() => {
    keycloak.login();
  }, []);

  const logout = useCallback(() => {
    keycloak.logout({
      redirectUri: window.location.origin + "/login",
    });
  }, []);

  const hasRole = useCallback((role) => {
    return keycloak.hasRealmRole(role);
  }, []);

  const roleHome = profile?.role ? ROLE_HOME[profile.role] : "/login";

  return {
    // State from Redux (serializable)
    status,
    profile,
    error,
    role: profile?.role || null,

    // Derived booleans
    isAuthenticated: status === "authenticated",
    isInitializing: status === "initializing" || status === "syncing",

    // Keycloak actions
    login,
    logout,
    hasRole,

    // Navigation helper
    roleHome,
  };
}

export default useAuth;
