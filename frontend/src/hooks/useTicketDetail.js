import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTicketById,
  submitStartTicket,
  submitResolveTicket,
  submitCloseTicket,
  clearDetail,
  clearActionError,
} from "../store/slices/ticketSlice";
import { addComment } from "../api/ticketApi";

function useTicketDetail(ticketId) {
  const dispatch = useDispatch();
  const { detail, detailStatus, detailError, actionLoading, actionError } =
    useSelector((state) => state.tickets);

  // Fetch on mount, clear on unmount
  useEffect(() => {
    if (ticketId) dispatch(fetchTicketById(ticketId));
    return () => dispatch(clearDetail());
  }, [ticketId, dispatch]);

  const refetch = useCallback(() => {
    if (ticketId) dispatch(fetchTicketById(ticketId));
  }, [ticketId, dispatch]);

  const handleStart = useCallback(async () => {
    await dispatch(submitStartTicket(ticketId));
    refetch(); // refresh detail to get updated status + timestamps
  }, [ticketId, dispatch, refetch]);

  const handleResolve = useCallback(async () => {
    await dispatch(submitResolveTicket(ticketId));
    refetch();
  }, [ticketId, dispatch, refetch]);

  const handleClose = useCallback(async () => {
    await dispatch(submitCloseTicket(ticketId));
    refetch();
  }, [ticketId, dispatch, refetch]);

  const handleAddComment = useCallback(
    async (commentText) => {
      // Comments don't go through Redux — they're local to the detail page
      // We call the API directly and then refetch the detail
      await addComment(ticketId, { comment: commentText });
      refetch();
    },
    [ticketId, refetch],
  );

  const clearError = useCallback(() => {
    dispatch(clearActionError());
  }, [dispatch]);

  return {
    ticket: detail,
    status: detailStatus,
    error: detailError,
    actionLoading,
    actionError,
    refetch,
    handleStart,
    handleResolve,
    handleClose,
    handleAddComment,
    clearError,
  };
}

export default useTicketDetail;
