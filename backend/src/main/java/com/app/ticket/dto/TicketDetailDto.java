package com.app.ticket.dto;

import com.app.ticket.entity.TicketCategory;
import com.app.ticket.entity.TicketPriority;
import com.app.ticket.entity.TicketStatus;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class TicketDetailDto implements Serializable {
    private UUID id;
    private String ticketNumber;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String location;

    // Creator info
    private UUID createdById;
    private String createdByName;

    // Assigned technician — both null if not yet assigned
    private UUID assignedToId;
    private String assignedToName;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;      // null until resolved

    // Nested lists — loaded with the ticket in one call
    private List<CommentResponse> comments;
    private List<AttachmentResponse> attachments;
}
