import api from "./axios";

// ─────────────────────────────────────────────
// TENANT APIs
// ─────────────────────────────────────────────

/**
 * POST /tickets
 * Creates a new ticket. Returns TicketSummaryDTO.
 */
export const createTicket = async (payload) => {
  const res = await api.post("/tickets", payload);
  return res.data;
};

/**
 * GET /tickets/my
 * Returns PagedResponse<TicketSummaryDTO> for the logged-in tenant.
 * @param {Object} params - { page, size, status, category }
 */
export const getMyTickets = async (params = {}) => {
  const res = await api.get("/tickets/my", { params });
  return res.data;
};

/**
 * GET /tickets/:id
 * Returns TicketDetailDTO — includes comments and attachments.
 */
export const getTicketById = async (id) => {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
};

/**
 * PUT /tickets/:id/close
 * RESOLVED → CLOSED. Returns updated TicketSummaryDTO.
 */
export const closeTicket = async (id) => {
  const res = await api.put(`/tickets/${id}/close`);
  return res.data;
};

/**
 * POST /tickets/:id/comments
 * Adds a comment. Returns CommentResponse.
 */
export const addComment = async (ticketId, payload) => {
  const res = await api.post(`/tickets/${ticketId}/comments`, payload);
  return res.data;
};

// ─────────────────────────────────────────────
// TECHNICIAN APIs
// ─────────────────────────────────────────────

/**
 * GET /technician/tickets
 * Returns PagedResponse<TicketSummaryDTO> assigned to the technician.
 */
export const getAssignedTickets = async (params = {}) => {
  const res = await api.get("/technician/tickets", { params });
  return res.data;
};

/**
 * PUT /technician/tickets/:id/start
 * ASSIGNED → IN_PROGRESS. Returns updated TicketSummaryDTO.
 */
export const startTicket = async (id) => {
  const res = await api.put(`/technician/tickets/${id}/start`);
  return res.data;
};

/**
 * PUT /technician/tickets/:id/resolve
 * IN_PROGRESS → RESOLVED. Returns updated TicketSummaryDTO.
 */
export const resolveTicket = async (id) => {
  const res = await api.put(`/technician/tickets/${id}/resolve`);
  return res.data;
};

// ─────────────────────────────────────────────
// ADMIN APIs
// ─────────────────────────────────────────────

/**
 * GET /admin/tickets
 * Returns PagedResponse<TicketSummaryDTO> — all tickets.
 * @param {Object} params - { page, size, status, category, priority }
 */
export const getAllTickets = async (params = {}) => {
  const res = await api.get("/admin/tickets", { params });
  return res.data;
};

/**
 * PUT /admin/tickets/:id/assign
 * OPEN → ASSIGNED. Returns updated TicketSummaryDTO.
 */
export const assignTicket = async (id, technicianId) => {
  const res = await api.put(`/admin/tickets/${id}/assign`, { technicianId });
  return res.data;
};

/**
 * GET /admin/technicians
 * Returns List<TechnicianSummaryDTO> for the assign dropdown.
 */
export const getTechnicians = async () => {
  const res = await api.get("/admin/technicians");
  return res.data;
};
