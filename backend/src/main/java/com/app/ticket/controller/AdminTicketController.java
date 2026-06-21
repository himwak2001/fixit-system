package com.app.ticket.controller;

import com.app.common.constants.TicketConstants;
import com.app.common.response.ApiResponse;
import com.app.ticket.dto.AssignTicketRequest;
import com.app.ticket.dto.TechnicianDto;
import com.app.ticket.dto.TicketResponseDTO;
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

    @GetMapping(path = "/tickets")
    public ResponseEntity<Page<TicketResponseDTO>> getAllTickets(@RequestParam(name = "page", defaultValue = "0") int pageNumber,
                                                                 @RequestParam(name = "size", defaultValue = "10") int pageSize,
                                                                 @RequestParam(name = "status", required = false) @ValidateTicketStatus String status,
                                                                 @RequestParam(name = "category", required = false) @ValidateTicketCategory String category,
                                                                 @RequestParam(name = "priority", required = false) @ValidateTicketPriority String priority,
                                                                 @RequestParam(name = "startDate", required = false) LocalDateTime startDate,
                                                                 @RequestParam(name = "endDate", required = false) LocalDateTime endDate) {
        Page<TicketResponseDTO> tickets = ticketService.getTickets(pageNumber, pageSize, status, category, priority, startDate, endDate);
        return ResponseEntity.status(HttpStatus.OK)
                .body(tickets);
    }

    @PutMapping("/tickets/assign")
    public ResponseEntity<ApiResponse> assignTicket(@RequestBody @Valid AssignTicketRequest request) {
        ticketService.assignTicketToTechnician(request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse(TicketConstants.STATUS_200, TicketConstants.MESSAGE_200, LocalDateTime.now()));
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<TechnicianDto>> getTechnicians() {
        List<TechnicianDto> technicians = ticketService.getTechnicianWithSpecialization();
        return ResponseEntity.status(HttpStatus.OK)
                .body(technicians);
    }
}
