package com.app.ticket.dto;

import com.app.auth.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CommentDto {
    private UUID commentId;
    private String comment;
    private String commentedBy;
    private LocalDateTime commentedAt;
    private String role;

    public CommentDto(UUID commentId, String comment, String commentedBy, LocalDateTime commentedAt, UserRole role) {
        this.commentId = commentId;
        this.comment = comment;
        this.commentedBy = commentedBy;
        this.commentedAt = commentedAt;
        this.role = role.name();
    }
}
