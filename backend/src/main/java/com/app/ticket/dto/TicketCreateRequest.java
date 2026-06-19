package com.app.ticket.dto;

import com.app.ticket.validation.annotation.ValidateTicketCategory;
import com.app.ticket.validation.annotation.ValidateTicketPriority;
import com.app.ticket.validation.annotation.ValidateTicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class TicketCreateRequest {
    @NotBlank(message = "Ticket title should not ne empty!")
    @Size(message = "Description cannot exceed 50 words!")
    private String title;

    @Size(max = 4000, message = "Description cannot exceed 500 words (approx. 4000 characters)!")
    private String description;

    @ValidateTicketCategory
    private String category;

    @ValidateTicketPriority
    private String priority;

    @NotBlank(message = "Ticket location should not ne empty!")
    private String location;

    @ValidateTicketStatus
    private String status;
}
