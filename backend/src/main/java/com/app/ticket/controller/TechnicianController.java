package com.app.ticket.controller;

import com.app.common.constants.TicketConstants;
import com.app.common.response.ApiResponse;
import com.app.ticket.dto.TicketResponseDTO;
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

    @GetMapping(path = "/")
    public ResponseEntity<List<TicketResponseDTO>> getTechnicianTickets(@RequestParam(value = "status", required = false) @ValidateTicketStatus String status) {
        List<TicketResponseDTO> tickets = ticketService.getTechnicianAssignedTicket(status);
        return ResponseEntity.status(HttpStatus.OK)
                .body(tickets);
    }

    @PutMapping(path = "/{ticketNumber}/start")
    public ResponseEntity<ApiResponse> startTicket(@PathVariable(value = "ticketNumber") String ticketNumber) {
        ticketService.startTicketByTechnician(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse(TicketConstants.STATUS_200, TicketConstants.MESSAGE_200, LocalDateTime.now()));
    }

    @PutMapping(path = "/{ticketNumber}/resolve")
    public ResponseEntity<ApiResponse> resolveTicket(@PathVariable(value = "ticketNumber") String ticketNumber) {
        ticketService.resolveTicketByTechnician(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse(TicketConstants.STATUS_200, TicketConstants.MESSAGE_200, LocalDateTime.now()));
    }
}
