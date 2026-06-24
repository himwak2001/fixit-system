package com.app.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
public class TicketSummaryDTO implements Serializable {
    // basic ticket details
    private TicketResponseDTO ticketDetails;

    // comments details
    private List<CommentResponse> comments;

    // attachment details
    private List<AttachmentDto> attachments;
}
