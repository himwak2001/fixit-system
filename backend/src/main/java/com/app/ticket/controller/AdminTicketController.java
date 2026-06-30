package com.app.ticket.controller;

import com.app.common.constants.TicketConstants;
import com.app.common.response.ApiResponse;
import com.app.ticket.dto.*;
import com.app.ticket.service.DashboardServiceImpl;
import com.app.ticket.service.TicketServiceImpl;
import com.app.ticket.validation.annotation.ValidateTicketCategory;
import com.app.ticket.validation.annotation.ValidateTicketPriority;
import com.app.ticket.validation.annotation.ValidateTicketStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/admin")
@RequiredArgsConstructor
@Validated
public class AdminTicketController {
    private final TicketServiceImpl ticketService;
    private final DashboardServiceImpl dashboardService;

    @GetMapping(path = "/tickets")
    public ResponseEntity<ApiResponse<PagedResponse<TicketSummaryDTO>>> getAllTickets(@RequestParam(name = "page", defaultValue = "0") int pageNumber,
                                                                                      @RequestParam(name = "size", defaultValue = "10") int pageSize,
                                                                                      @RequestParam(name = "status", required = false) @ValidateTicketStatus String status,
                                                                                      @RequestParam(name = "category", required = false) @ValidateTicketCategory String category,
                                                                                      @RequestParam(name = "priority", required = false) @ValidateTicketPriority String priority,
                                                                                      @RequestParam(name = "startDate", required = false) LocalDateTime startDate,
                                                                                      @RequestParam(name = "endDate", required = false) LocalDateTime endDate) {
        PagedResponse<TicketSummaryDTO> tickets = ticketService.getTickets(pageNumber, pageSize, status, category, priority, startDate, endDate);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("All tickets fetched successfully", tickets));
    }

    @PutMapping("/tickets/assign")
    public ResponseEntity<ApiResponse<TicketSummaryDTO>> assignTicket(@RequestBody @Valid AssignTicketRequest request) {
        TicketSummaryDTO ticketSummary = ticketService.assignTicketToTechnician(request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Ticket assigned successfully", ticketSummary));
    }

    @GetMapping("/technicians")
    public ResponseEntity<ApiResponse<List<TechnicianSummaryDTO>>> getTechnicians() {
        List<TechnicianSummaryDTO> technicians = ticketService.getTechnicianWithSpecialization();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Technicians fetched successfully", technicians));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = dashboardService.getStats();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Dashboard stats fetched successfully", stats));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = dashboardService.getStats();
        return ResponseEntity.status(HttpStatus.OK)
                .body(stats);
    }
}
