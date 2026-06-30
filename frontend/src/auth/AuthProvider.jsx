import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import keycloak from "./keycloak";
import {
  setInitializing,
  setAuthenticated,
  setUnauthenticated,
  setError,
} from "../store/slices/authSlice";
import { syncUser } from "../api/authApi";

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  // useRef prevents double-init in React Strict Mode
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    dispatch(setInitializing());

    keycloak
      .init({
        onLoad: "check-sso",
        // This HTML file runs in a hidden iframe to silently detect existing sessions
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256", // Proof Key for Code Exchange — secure for public clients
      })
      .then(async (authenticated) => {
        if (authenticated) {
          try {
            // Sync Keycloak user to our PostgreSQL DB and get full profile back
            const profile = await syncUser();
            dispatch(setAuthenticated(profile));
          } catch (err) {
            console.error("[AuthProvider] sync failed:", err.message);
            dispatch(
              setError("Failed to load user profile. Please try again."),
            );
          }
        } else {
          dispatch(setUnauthenticated());
        }
      })
      .catch((err) => {
        console.error("[AuthProvider] Keycloak init failed:", err);
        dispatch(setError("Authentication service unavailable."));
      });

    // Automatically refresh the access token before it expires
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60).catch(() => {
        // If refresh fails, user session is gone — redirect to login
        dispatch(setUnauthenticated());
        keycloak.login();
      });
    };
  }, [dispatch]);

  return children;
}

export default AuthProvider;
