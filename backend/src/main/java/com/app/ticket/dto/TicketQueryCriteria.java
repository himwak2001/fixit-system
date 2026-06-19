package com.app.ticket.dto;

import com.app.ticket.validation.annotation.ValidateTicketCategory;
import com.app.ticket.validation.annotation.ValidateTicketStatus;
import lombok.Data;

@Data
public class TicketQueryCriteria {
    @ValidateTicketStatus
    private String status;

    @ValidateTicketCategory
    private String category;
    private int page = 0;
    private int size = 10;
}
