import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyTickets,
  fetchAssignedTickets,
  setFilter,
  resetFilters,
} from "../store/slices/ticketSlice";
import useAuth from "./useAuth";
import { USER_ROLE } from "../utils/constants";

/**
 * Encapsulates ticket list fetching logic.
 * Automatically uses the correct API based on the current user's role.
 * Components just call useTickets() and get back what they need.
 */
function useTickets() {
  const dispatch = useDispatch();
  const { role } = useAuth();
  const {
    list,
    listStatus,
    listError,
    pagination,
    filters,
    actionLoading,
    actionError,
  } = useSelector((state) => state.tickets);

  // Determine which fetch to use based on role
  const fetchTickets = useCallback(
    (params = {}) => {
      const merged = {
        page: 0,
        size: 10,
        ...filters,
        ...params,
        // Strip empty strings — backend ignores null but gets confused by ""
        ...Object.fromEntries(
          Object.entries({ ...filters, ...params }).filter(
            ([, v]) => v !== "" && v !== null && v !== undefined,
          ),
        ),
      };

      if (role === USER_ROLE.TECHNICIAN) {
        dispatch(fetchAssignedTickets(merged));
      } else {
        dispatch(fetchMyTickets(merged));
      }
    },
    [dispatch, role, filters],
  );

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(setFilter(newFilters));
    },
    [dispatch],
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const handlePageChange = useCallback(
    (newPage) => {
      fetchTickets({ page: newPage });
    },
    [fetchTickets],
  );

  return {
    tickets: list,
    status: listStatus,
    error: listError,
    pagination,
    filters,
    actionLoading,
    actionError,
    refetch: fetchTickets,
    onFilterChange: handleFilterChange,
    onResetFilters: handleResetFilters,
    onPageChange: handlePageChange,
  };
}

export default useTickets;
