import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AppShell from "./components/layout/AppShell";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import MyTicketsPage from "./pages/tenant/MyTicketsPage";
import TicketDetailPage from "./pages/tenant/TicketDetailPage";
import AssignedTicketsPage from "./pages/technician/AssignedTicketsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AllTicketsPage from "./pages/admin/AllTicketsPage";
import { USER_ROLE } from "./utils/constants";
import ProfilePage from "./pages/ProfilePage";

const { TENANT, TECHNICIAN, ADMIN } = USER_ROLE;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={[TENANT, TECHNICIAN, ADMIN]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Tenant */}
          <Route
            path="my-tickets"
            element={
              <ProtectedRoute allowedRoles={[TENANT]}>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />

          {/*
            Ticket detail — accessible by TENANT, TECHNICIAN, ADMIN.
            Each role sees the same detail page but different action buttons.
          */}
          <Route
            path="tickets/:id"
            element={
              <ProtectedRoute allowedRoles={[TENANT, TECHNICIAN, ADMIN]}>
                <TicketDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Technician */}
          <Route
            path="assigned-tickets"
            element={
              <ProtectedRoute allowedRoles={[TECHNICIAN]}>
                <AssignedTicketsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={[ADMIN]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="all-tickets"
            element={
              <ProtectedRoute allowedRoles={[ADMIN]}>
                <AllTicketsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
