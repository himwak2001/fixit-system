package com.app.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttachmentConfirmRequest {
    @NotBlank(message = "S3 key is required")
    private String s3Key;

    @NotBlank(message = "File name is required")
    private String fileName;
}
