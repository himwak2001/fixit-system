package com.app.ticket.entity;

import com.app.auth.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ticket_attachment_tbl")
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
}
