package com.app.ticket.service;

import com.app.ticket.dto.DashboardStatsResponse;

public interface IDashboardService {
    // method to get statistics of tickets
    DashboardStatsResponse getStats();
}
