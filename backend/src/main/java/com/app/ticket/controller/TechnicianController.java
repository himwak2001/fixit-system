package com.app.ticket.controller;

import com.app.common.constants.TicketConstants;
import com.app.common.response.ApiResponse;
import com.app.ticket.dto.PagedResponse;
import com.app.ticket.dto.TicketResponseDTO;
import com.app.ticket.dto.TicketSummaryDTO;
import com.app.ticket.service.TicketServiceImpl;
import com.app.ticket.validation.annotation.ValidateTicketStatus;
import jakarta.ws.rs.Path;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/technician/tickets")
@RequiredArgsConstructor
@Validated
public class TechnicianController {
    private final TicketServiceImpl ticketService;

    @GetMapping(path = "")
    public ResponseEntity<ApiResponse<PagedResponse<TicketSummaryDTO>>> getTechnicianTickets(@RequestParam(name = "page", defaultValue = "0") int pageNumber, @RequestParam(name = "size", defaultValue = "10") int pageSize, @RequestParam(value = "status", required = false) @ValidateTicketStatus String status) {
        PagedResponse<TicketSummaryDTO> tickets = ticketService.getTechnicianAssignedTicket(pageNumber, pageSize, status);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Assigned tickets fetched successfully", tickets));
    }

    @PutMapping(path = "/{ticketNumber}/start")
    public ResponseEntity<ApiResponse<TicketSummaryDTO>> startTicket(@PathVariable(value = "ticketNumber") String ticketNumber) {
        TicketSummaryDTO ticket = ticketService.startTicketByTechnician(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Ticket marked as In Progress", ticket));
    }

    @PutMapping(path = "/{ticketNumber}/resolve")
    public ResponseEntity<ApiResponse<TicketSummaryDTO>> resolveTicket(@PathVariable(value = "ticketNumber") String ticketNumber) {
        TicketSummaryDTO ticket = ticketService.resolveTicketByTechnician(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Ticket marked as Resolved", ticket));
    }
}
