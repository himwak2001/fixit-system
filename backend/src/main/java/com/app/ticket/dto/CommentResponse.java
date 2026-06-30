package com.app.ticket.dto;

import com.app.auth.entity.UserRole;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse implements Serializable {
    private UUID commentId;
    private String comment;
    private String commentedBy;
    private LocalDateTime createdAt;
    private String role;
}
