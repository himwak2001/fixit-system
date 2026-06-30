package com.app.ticket.controller;

import com.app.common.constants.TicketConstants;
import com.app.common.response.ApiResponse;
import com.app.ticket.dto.*;
import com.app.ticket.service.TicketAttachmentServiceImpl;
import com.app.ticket.service.TicketCommentServiceImpl;
import com.app.ticket.service.TicketServiceImpl;
import com.app.ticket.validation.annotation.ValidateTicketCategory;
import com.app.ticket.validation.annotation.ValidateTicketPriority;
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
import java.util.List;
import java.util.UUID;

@Validated
@RestController
@RequestMapping(path = "/api/v1/tickets", produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class TicketController {
    private final TicketServiceImpl ticketService;
    private final TicketCommentServiceImpl commentService;
    private final TicketAttachmentServiceImpl ticketAttachmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<TicketSummaryDTO>> createTicket(@RequestBody @Valid TicketCreateRequest request) {
        TicketSummaryDTO ticket = ticketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ticket created successfully", ticket));
    }

    @GetMapping(path = "/my")
    public ResponseEntity<ApiResponse<PagedResponse<TicketSummaryDTO>>> getMyTickets(@RequestParam(name = "page", defaultValue = "0") int pageNumber, @RequestParam(name = "size", defaultValue = "10") int pageSize, @RequestParam(name = "status", defaultValue = "", required = false) @ValidateTicketStatus String status, @RequestParam(name = "category", defaultValue = "", required = false) @ValidateTicketCategory String category, @RequestParam(name = "priority", defaultValue = "", required = false) @ValidateTicketPriority String priority) {
        PagedResponse<TicketSummaryDTO> tickets = ticketService.getMyTickets(pageNumber, pageSize, status, category, priority);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Tickets fetched successfully", tickets));
    }

    @GetMapping("/{ticketNumber}")
    public ResponseEntity<ApiResponse<TicketDetailDto>> getTicketDetails(@PathVariable(name = "ticketNumber") String ticketNumber) {
        TicketDetailDto detail = ticketService.getTicketDetails(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Ticket fetched successfully", detail));
    }

    @PostMapping(path = "/{ticketNumber}/upload-url")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getUploadUrl(@PathVariable(name = "ticketNumber") String ticketNumber, @Valid @RequestBody PresignedUrlRequest request) {
        PresignedUrlResponse response = ticketAttachmentService.generateUploadUrl(ticketNumber, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Upload URL generated successfully", response));
    }

    @PostMapping(path = "/{ticketNumber}/attachments")
    public ResponseEntity<ApiResponse<AttachmentResponse>> confirmUpload(@PathVariable(name = "ticketNumber") String ticketNumber, @Valid @RequestBody AttachmentConfirmRequest request) {
        AttachmentResponse response = ticketAttachmentService.confirmUpload(ticketNumber, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Attachment saved successfully", response));
    }

    @GetMapping(path = "/{ticketNumber}/attachments/{attachmentId}/view")
    public ResponseEntity<ApiResponse<ViewUrlResponse>> getViewUrl(@PathVariable(name = "ticketNumber") String ticketNumber, @PathVariable(name = "attachmentId") UUID attachmentId) {
        ViewUrlResponse response = ticketAttachmentService.getViewUrl(ticketNumber, attachmentId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("View URL generated successfully", response));
    }

    @PostMapping(path = "/{ticketNumber}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(@PathVariable(name = "ticketNumber") String ticketNumber, @Valid @RequestBody CommentRequest request) {
        CommentResponse response = commentService.addComment(ticketNumber, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added successfully", response));
    }

    @GetMapping(path = "/{ticketNumber}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable(name = "ticketNumber") String ticketNumber) {
        List<CommentResponse> comments = commentService.getComments(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Comments fetched successfully", comments));
    }

    @PutMapping("/{ticketNumber}/close")
    public ResponseEntity<ApiResponse<TicketSummaryDTO>> closeTicket(@PathVariable(name = "ticketNumber") String ticketNumber) {
        TicketSummaryDTO detail = ticketService.closeTicket(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Ticket closed successfully", detail));
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

    @PostMapping(path = "/{ticketNumber}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable(name = "ticketNumber") String ticketNumber, @Valid @RequestBody CommentRequest request) {
        CommentResponse response = commentService.addComment(ticketNumber, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping(path = "/{ticketNumber}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable(name = "ticketNumber") String ticketNumber) {
        List<CommentResponse> comments = commentService.getComments(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(comments);
    }

    @GetMapping("/{ticketNumber}/close")
    public ResponseEntity<ApiResponse> closeTicket(@PathVariable(name = "ticketNumber") String ticketNumber) {
        ticketService.closeTicket(ticketNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ApiResponse(TicketConstants.STATUS_200, TicketConstants.MESSAGE_200, LocalDateTime.now()));
    }
}
