package com.app.ticket.dto;

import com.app.ticket.entity.TicketCategory;
import com.app.ticket.entity.TicketPriority;
import com.app.ticket.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TicketSummaryDTO implements Serializable {
    private UUID id;
    private String ticketNumber;    // "TKT-2024-00012"
    private String title;
    private TicketCategory category;        // PLUMBING, ELECTRICAL etc
    private TicketPriority priority;        // LOW, MEDIUM, HIGH, URGENT
    private TicketStatus status;          // OPEN, ASSIGNED etc
    private String location;        // "Block A, Room 204"
    private String createdByName;   // "Priya Sharma"
    private String assignedToName;  // "Ramesh Kumar" or null
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
