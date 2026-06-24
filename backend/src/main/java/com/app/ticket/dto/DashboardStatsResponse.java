package com.app.ticket.dto;

import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.util.List;

@Getter
@Builder
public class DashboardStatsResponse implements Serializable {
    // Counts by status
    private long totalTickets;
    private long openCount;
    private long assignedCount;
    private long inProgressCount;
    private long resolvedCount;
    private long closedCount;

    // Breakdown by category
    private List<CategoryStats> byCategory;

    // Breakdown by priority
    private List<PriorityStats> byPriority;

    @Getter
    @Builder
    public static class CategoryStats implements Serializable {
        private String category;
        private long count;
    }

    @Getter
    @Builder
    public static class PriorityStats implements Serializable {
        private String priority;
        private long count;
    }
}
