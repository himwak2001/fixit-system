import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTickets,
  fetchTechnicians,
  submitAssignTicket,
  setAdminFilter,
  resetAdminFilters,
  clearAssignError,
} from "../store/slices/adminSlice";

function useAdminTickets() {
  const dispatch = useDispatch();
  const {
    list,
    listStatus,
    listError,
    pagination,
    filters,
    technicians,
    techniciansStatus,
    assignLoading,
    assignError,
  } = useSelector((s) => s.admin);

  const fetchTickets = useCallback(
    (params = {}) => {
      // Strip empty string values before sending to backend
      const cleaned = Object.fromEntries(
        Object.entries({ page: 0, size: 10, ...filters, ...params }).filter(
          ([, v]) => v !== "" && v != null,
        ),
      );
      dispatch(fetchAllTickets(cleaned));
    },
    [dispatch, filters],
  );

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Fetch technicians once — used for assign modal dropdown
  useEffect(() => {
    if (techniciansStatus === "idle") {
      dispatch(fetchTechnicians());
    }
  }, [techniciansStatus, dispatch]);

  const handleFilterChange = useCallback(
    (newFilters) => dispatch(setAdminFilter(newFilters)),
    [dispatch],
  );

  const handleResetFilters = useCallback(
    () => dispatch(resetAdminFilters()),
    [dispatch],
  );

  const handlePageChange = useCallback(
    (newPage) => fetchTickets({ page: newPage }),
    [fetchTickets],
  );

  const handleAssign = useCallback(
    async (ticketId, technicianId) => {
      const result = await dispatch(
        submitAssignTicket({ ticketId, technicianId }),
      );
      return submitAssignTicket.fulfilled.match(result);
    },
    [dispatch],
  );

  const handleClearAssignError = useCallback(
    () => dispatch(clearAssignError()),
    [dispatch],
  );

  return {
    tickets: list,
    status: listStatus,
    error: listError,
    pagination,
    filters,
    technicians,
    techniciansStatus,
    assignLoading,
    assignError,
    refetch: fetchTickets,
    onFilterChange: handleFilterChange,
    onResetFilters: handleResetFilters,
    onPageChange: handlePageChange,
    onAssign: handleAssign,
    clearAssignError: handleClearAssignError,
  };
}

export default useAdminTickets;
