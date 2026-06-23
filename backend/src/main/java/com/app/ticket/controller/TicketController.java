package com.app.ticket.controller;

import com.app.common.constants.TicketConstants;
import com.app.common.response.ApiResponse;
import com.app.ticket.dto.*;
import com.app.ticket.service.TicketAttachmentServiceImpl;
import com.app.ticket.service.TicketServiceImpl;
import com.app.ticket.validation.annotation.ValidateTicketCategory;
import com.app.ticket.validation.annotation.ValidateTicketStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.parser.HttpParser;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Validated
@RestController
@RequestMapping(path = "/api/v1/tickets", produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class TicketController {
    private final TicketServiceImpl ticketService;
    private final TicketAttachmentServiceImpl ticketAttachmentService;

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

    @PostMapping(path = "/{ticketNumber}/upload-url")
    public ResponseEntity<PresignedUrlResponse> getUploadUrl(@PathVariable(name = "ticketNumber") String ticketNumber, @Valid @RequestBody PresignedUrlRequest request) {
        PresignedUrlResponse response = ticketAttachmentService.generateUploadUrl(ticketNumber, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(response);
    }

    @PostMapping(path = "/{ticketNumber}/attachments")
    public ResponseEntity<AttachmentResponse> confirmUpload(@PathVariable(name = "ticketNumber") String ticketNumber, @Valid @RequestBody AttachmentConfirmRequest request) {
        AttachmentResponse response = ticketAttachmentService.confirmUpload(ticketNumber, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(response);
    }

    @GetMapping(path = "/{ticketNumber}/attachments/{attachmentId}/view")
    public ResponseEntity<ViewUrlResponse> getViewUrl(@PathVariable(name = "ticketNumber") String ticketNumber, @PathVariable(name = "attachmentId") UUID attachmentId) {
        ViewUrlResponse response = ticketAttachmentService.getViewUrl(ticketNumber, attachmentId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(response);
    }
}
