import api from "./axios";

/**
 * GET /admin/tickets
 * Returns PagedResponse<TicketSummaryDTO>
 * params: { page, size, status, category, priority }
 */
export const getAllTickets = async (params = {}) => {
  const res = await api.get("/admin/tickets", { params });
  return res.data;
};

/**
 * PUT /admin/tickets/:id/assign
 * Body: { technicianId }
 * Returns updated TicketSummaryDTO
 */
export const assignTicket = async (ticketId, technicianId) => {
  const res = await api.put(`/admin/tickets/assign`, {
    ticketNumber: ticketId,
    assigneeId: technicianId,
  });
  return res.data;
};

/**
 * GET /admin/technicians
 * Returns List<TechnicianSummaryDTO>
 */
export const getTechnicians = async () => {
  const res = await api.get("/admin/technicians");
  return res.data;
};

/**
 * GET /admin/dashboard/stats
 * Returns DashboardStatsResponse
 */
export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data;
};
