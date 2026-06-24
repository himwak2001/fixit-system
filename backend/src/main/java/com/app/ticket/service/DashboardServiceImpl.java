package com.app.ticket.service;

import com.app.ticket.dto.DashboardStatsResponse;
import com.app.ticket.entity.TicketStatus;
import com.app.ticket.repository.ITicketRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements IDashboardService {
    private final ITicketRepository ticketRepository;

    @Override
    @Cacheable(value = "ticket:dashboard", key = "'dashboard'")
    public DashboardStatsResponse getStats() {
        // fetch all three aggregations
        List<Object[]> byStatus = ticketRepository.countGroupByStatus();
        List<Object[]> byCategory = ticketRepository.countGroupByCategory();
        List<Object[]> byPriority = ticketRepository.countGroupByPriority();

        // build status map
        Map<TicketStatus, Long> statusMap = buildStatusMap(byStatus);

        // build category stats list
        List<DashboardStatsResponse.CategoryStats> categoryStats = buildCategoryStats(byCategory);

        // build priority stats list
        List<DashboardStatsResponse.PriorityStats> priorityStats = buildPriorityStats(byPriority);

        long total = statusMap.values()
                .stream()
                .mapToLong(Long::longValue)
                .sum();

        log.info("Dashboard stats fetched — total tickets: {}", total);

        return DashboardStatsResponse.builder()
                .totalTickets(total)
                .openCount(statusMap.getOrDefault(TicketStatus.OPEN, 0L))
                .assignedCount(statusMap.getOrDefault(TicketStatus.ASSIGNED, 0L))
                .inProgressCount(statusMap.getOrDefault(TicketStatus.IN_PROGRESS, 0L))
                .resolvedCount(statusMap.getOrDefault(TicketStatus.RESOLVED, 0L))
                .closedCount(statusMap.getOrDefault(TicketStatus.CLOSED, 0L))
                .byCategory(categoryStats)
                .byPriority(priorityStats)
                .build();
    }

    private Map<TicketStatus, Long> buildStatusMap(List<Object[]> rows) {
        // Each row: [TicketStatus enum value, Long count]
        Map<TicketStatus, Long> map = new HashMap<>();
        for (Object[] row : rows) {
            TicketStatus status = (TicketStatus) row[0];
            Long count = (Long) row[1];
            map.put(status, count);
        }
        return map;
    }

    private List<DashboardStatsResponse.CategoryStats> buildCategoryStats(
            List<Object[]> rows) {

        return rows.stream()
                .map(row -> DashboardStatsResponse.CategoryStats.builder()
                        .category(row[0].toString())
                        .count((Long) row[1])
                        .build())
                .sorted(Comparator.comparingLong(
                                DashboardStatsResponse.CategoryStats::getCount)
                        .reversed()) // highest count first
                .toList();
    }

    private List<DashboardStatsResponse.PriorityStats> buildPriorityStats(
            List<Object[]> rows) {

        return rows.stream()
                .map(row -> DashboardStatsResponse.PriorityStats.builder()
                        .priority(row[0].toString())
                        .count((Long) row[1])
                        .build())
                .toList();
    }
}
