package com.app.ticket.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class TicketResponseDTO implements Serializable {
    private String ticketNumber;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String location;
    private String status;
    private String assignedTo;
    private LocalDateTime createdAt;
}
