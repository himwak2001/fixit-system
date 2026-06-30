import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../components/ui/LoadingScreen";

/**
 * @param {string[]} allowedRoles - e.g. ['ADMIN'] or ['TENANT', 'ADMIN']
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { status, role } = useAuth();

  // Keycloak is still initializing (silent SSO check in progress)
  if (status === "initializing") {
    return <LoadingScreen message="Checking session..." />;
  }

  // Keycloak confirmed — no session exists
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // Something went wrong during init or sync
  if (status === "error") {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated but doesn't have the required role
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
