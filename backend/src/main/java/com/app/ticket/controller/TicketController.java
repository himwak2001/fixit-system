package com.app.ticket.controller;

import com.app.common.constants.TicketConstants;
import com.app.common.response.ApiResponse;
import com.app.ticket.dto.TicketCreateRequest;
import com.app.ticket.dto.TicketQueryCriteria;
import com.app.ticket.dto.TicketResponseDTO;
import com.app.ticket.dto.TicketSummaryDTO;
import com.app.ticket.service.TicketServiceImpl;
import com.app.ticket.validation.annotation.ValidateTicketCategory;
import com.app.ticket.validation.annotation.ValidateTicketStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Validated
@RestController
@RequestMapping(path = "/api/v1/tickets", produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class TicketController {
    private final TicketServiceImpl ticketService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse> createTicket(@RequestBody @Valid TicketCreateRequest request) {
        String ticketNumber = ticketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(TicketConstants.STATUS_201, TicketConstants.getSyncMessage(ticketNumber), LocalDateTime.now()));
    }

    @GetMapping(path = "/me")
    public ResponseEntity<Page<TicketResponseDTO>> getMyTickets(@RequestParam(name = "page", defaultValue = "0") int pageNumber, @RequestParam(name = "size", defaultValue = "10") int pageSize, @RequestParam(name = "status", defaultValue = "", required = false) @ValidateTicketStatus String status, @RequestParam(name = "category", defaultValue = "", required = false) @ValidateTicketCategory String category) {
        Page<TicketResponseDTO> tickets = ticketService.getMyTickets(pageNumber, pageSize, status, category);
        return ResponseEntity.status(HttpStatus.OK)
                .body(tickets);
    }

    @GetMapping("/{ticketNumber}")
    public ResponseEntity<TicketSummaryDTO> getTicketDetails(@PathVariable(name = "ticketNumber") String ticketNumber) {
        TicketSummaryDTO summary = ticketService.getTicketDetails(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(summary);
    }
}
