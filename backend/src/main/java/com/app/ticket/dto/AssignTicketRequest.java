package com.app.ticket.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.UUID;

@Data
public class AssignTicketRequest {
    @NotEmpty(message = "Ticket Number shouldn't be empty")
    private String ticketNumber;

    @NotEmpty(message = "Assignee Id shouldn't be empty")
    private String assigneeId;
}
