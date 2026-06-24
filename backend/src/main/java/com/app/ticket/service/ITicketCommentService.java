package com.app.ticket.service;

import com.app.ticket.dto.CommentRequest;
import com.app.ticket.dto.CommentResponse;

import java.util.List;

public interface ITicketCommentService {
    // method to add comment
    CommentResponse addComment(String ticketNumber, CommentRequest request);

    // method to get all comments of that ticket
    List<CommentResponse> getComments(String ticketNumber);
}
