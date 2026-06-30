import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyTickets,
  createTicket,
  getTicketById,
  getAssignedTickets,
  startTicket,
  resolveTicket,
  closeTicket,
} from "../../api/ticketApi";

// ── Async thunks ─────────────────────────────────────────────

export const fetchMyTickets = createAsyncThunk(
  "tickets/fetchMy",
  async (params, { rejectWithValue }) => {
    try {
      return await getMyTickets(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAssignedTickets = createAsyncThunk(
  "tickets/fetchAssigned",
  async (params, { rejectWithValue }) => {
    try {
      return await getAssignedTickets(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTicketById = createAsyncThunk(
  "tickets/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getTicketById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const submitCreateTicket = createAsyncThunk(
  "tickets/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createTicket(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const submitStartTicket = createAsyncThunk(
  "tickets/start",
  async (id, { rejectWithValue }) => {
    try {
      return await startTicket(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const submitResolveTicket = createAsyncThunk(
  "tickets/resolve",
  async (id, { rejectWithValue }) => {
    try {
      return await resolveTicket(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const submitCloseTicket = createAsyncThunk(
  "tickets/close",
  async (id, { rejectWithValue }) => {
    try {
      return await closeTicket(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────

const initialState = {
  // List state — shared between tenant and technician list pages
  list: [],
  listStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  listError: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
  },

  // Filters — kept in Redux so they survive page navigations
  filters: {
    status: "",
    category: "",
    priority: "",
  },

  // Single ticket detail
  detail: null,
  detailStatus: "idle",
  detailError: null,

  // Action loading states — for individual button spinners
  actionLoading: false,
  actionError: null,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // Called when filter dropdowns change
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Reset filters — called on page unmount or "Clear" button
    resetFilters(state) {
      state.filters = { status: "", category: "", priority: "" };
    },
    // Clear the detail — called when leaving detail page
    clearDetail(state) {
      state.detail = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
    // Update one ticket in the list after a status change
    // Avoids refetching the entire list
    updateTicketInList(state, action) {
      const updated = action.payload;
      const idx = state.list.findIndex((t) => t.id === updated.id);
      if (idx !== -1) state.list[idx] = updated;
    },
    clearActionError(state) {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch list (my tickets or assigned tickets) ──
    builder
      .addCase(fetchMyTickets.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          last: action.payload.last,
        };
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      })

      // ── Assigned tickets (same list shape) ──
      .addCase(fetchAssignedTickets.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchAssignedTickets.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          last: action.payload.last,
        };
      })
      .addCase(fetchAssignedTickets.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      })

      // ── Ticket detail ──
      .addCase(fetchTicketById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload;
      })

      // ── Create ticket ──
      .addCase(submitCreateTicket.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(submitCreateTicket.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Prepend to the list so newly created ticket appears first
        state.list.unshift(action.payload);
        state.pagination.totalElements += 1;
      })
      .addCase(submitCreateTicket.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // ── Start / Resolve / Close — all update one ticket in the list ──
      .addMatcher(
        (action) =>
          [
            submitStartTicket.pending.type,
            submitResolveTicket.pending.type,
            submitCloseTicket.pending.type,
          ].includes(action.type),
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        },
      )
      .addMatcher(
        (action) =>
          [
            submitStartTicket.fulfilled.type,
            submitResolveTicket.fulfilled.type,
            submitCloseTicket.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.actionLoading = false;
          // Update the ticket in-place in the list
          const updated = action.payload;
          const idx = state.list.findIndex((t) => t.id === updated.id);
          if (idx !== -1) state.list[idx] = updated;
          // Also update detail if we're on the detail page
          if (state.detail?.id === updated.id) {
            state.detail = { ...state.detail, ...updated };
          }
        },
      )
      .addMatcher(
        (action) =>
          [
            submitStartTicket.rejected.type,
            submitResolveTicket.rejected.type,
            submitCloseTicket.rejected.type,
          ].includes(action.type),
        (state, action) => {
          state.actionLoading = false;
          state.actionError = action.payload;
        },
      );
  },
});

export const {
  setFilter,
  resetFilters,
  clearDetail,
  updateTicketInList,
  clearActionError,
} = ticketSlice.actions;

export default ticketSlice.reducer;
