package com.app.ticket.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ViewUrlResponse {
    private String viewUrl;
    private long expiresInSeconds;
}
