import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTickets,
  assignTicket,
  getTechnicians,
  getDashboardStats,
} from "../../api/adminApi";

// ── Async thunks ─────────────────────────────────────────

export const fetchAllTickets = createAsyncThunk(
  "admin/fetchAllTickets",
  async (params, { rejectWithValue }) => {
    try {
      return await getAllTickets(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchTechnicians = createAsyncThunk(
  "admin/fetchTechnicians",
  async (_, { rejectWithValue }) => {
    try {
      return await getTechnicians();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const submitAssignTicket = createAsyncThunk(
  "admin/assignTicket",
  async ({ ticketId, technicianId }, { rejectWithValue }) => {
    try {
      return await assignTicket(ticketId, technicianId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await getDashboardStats();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ── Slice ─────────────────────────────────────────────────

const initialState = {
  // All tickets list
  list: [],
  listStatus: "idle",
  listError: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
  },
  filters: {
    status: "",
    category: "",
    priority: "",
  },

  // Technicians for assign dropdown
  technicians: [],
  techniciansStatus: "idle",

  // Assign action
  assignLoading: false,
  assignError: null,

  // Dashboard stats
  stats: null,
  statsStatus: "idle",
  statsError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetAdminFilters(state) {
      state.filters = { status: "", category: "", priority: "" };
    },
    updateTicketInAdminList(state, action) {
      const updated = action.payload;
      const idx = state.list.findIndex((t) => t.id === updated.id);
      if (idx !== -1) state.list[idx] = updated;
    },
    clearAssignError(state) {
      state.assignError = null;
    },
  },
  extraReducers: (builder) => {
    // ── All tickets ──
    builder
      .addCase(fetchAllTickets.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
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
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      })

      // ── Technicians ──
      .addCase(fetchTechnicians.pending, (state) => {
        state.techniciansStatus = "loading";
      })
      .addCase(fetchTechnicians.fulfilled, (state, action) => {
        state.techniciansStatus = "succeeded";
        state.technicians = action.payload;
      })
      .addCase(fetchTechnicians.rejected, (state) => {
        state.techniciansStatus = "failed";
      })

      // ── Assign ──
      .addCase(submitAssignTicket.pending, (state) => {
        state.assignLoading = true;
        state.assignError = null;
      })
      .addCase(submitAssignTicket.fulfilled, (state, action) => {
        state.assignLoading = false;
        // Update the ticket in-place so table reflects new status + assignee
        const updated = action.payload;
        const idx = state.list.findIndex((t) => t.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
      })
      .addCase(submitAssignTicket.rejected, (state, action) => {
        state.assignLoading = false;
        state.assignError = action.payload;
      })

      // ── Dashboard stats ──
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsStatus = "loading";
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload;
      });
  },
});

export const {
  setAdminFilter,
  resetAdminFilters,
  updateTicketInAdminList,
  clearAssignError,
} = adminSlice.actions;

export default adminSlice.reducer;
