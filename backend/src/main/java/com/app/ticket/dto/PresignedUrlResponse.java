package com.app.ticket.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PresignedUrlResponse {
    private String uploadUrl;
    private String s3Key;
    private long expiresInSeconds;
}
