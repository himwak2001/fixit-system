package com.app.ticket.dto;

import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class AttachmentResponse implements Serializable {
    private UUID id;
    private String fileName;
    private String uploadedBy;
    private LocalDateTime uploadedAt;
}
