import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../store/slices/adminSlice";

function useAdminStats() {
  const dispatch = useDispatch();
  const { stats, statsStatus, statsError } = useSelector((s) => s.admin);

  useEffect(() => {
    // Only fetch if not already loaded
    if (statsStatus === "idle") {
      dispatch(fetchDashboardStats());
    }
  }, [statsStatus, dispatch]);

  const refetch = () => dispatch(fetchDashboardStats());

  return { stats, status: statsStatus, error: statsError, refetch };
}

export default useAdminStats;
