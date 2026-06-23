package com.app.ticket.entity;

import com.app.auth.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ticket_attachment_tbl")
@Builder
@NoArgsConstructor
@Getter
@Setter
public class TicketAttachment {
    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @Column(name = "s3_key")
    private String s3Key;

    @Column(name = "file_name")
    private String fileName;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User user;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    public TicketAttachment(UUID id, Ticket ticket, String s3Key, String fileName, User user, LocalDateTime uploadedAt) {
        this.id = id;
        this.ticket = ticket;
        this.s3Key = s3Key;
        this.fileName = fileName;
        this.user = user;
        this.uploadedAt = uploadedAt;
    }
}
