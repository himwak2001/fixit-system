package com.app.ticket.service;

import com.app.ticket.dto.*;

import java.util.UUID;

public interface ITicketAttachmentService {
    PresignedUrlResponse generateUploadUrl(String ticketNumber, PresignedUrlRequest request);

    AttachmentResponse confirmUpload(String ticketNumber, AttachmentConfirmRequest request);

    ViewUrlResponse getViewUrl(String ticketNumber, UUID attachmentId);
}
