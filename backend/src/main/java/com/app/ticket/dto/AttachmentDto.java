package com.app.ticket.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AttachmentDto {
    private UUID attachmentId;
    private String fileName;
    private String s3Key;
    private String url;
    private LocalDateTime uploadedAt;

    public AttachmentDto(UUID attachmentId, String fileName, String s3Key, LocalDateTime uploadedAt) {
        this.attachmentId = attachmentId;
        this.fileName = fileName;
        this.s3Key = s3Key;
        this.uploadedAt = uploadedAt;
    }
}
