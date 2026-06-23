package com.app.ticket.service;

import com.app.ticket.dto.PresignedUrlResponse;

public interface IFileStorageService {
    /**
     * Generates a pre-signed PUT URL for direct client-to-S3 upload.
     * Returns the URL and the S3 key to be stored after upload confirmation.
     */
    PresignedUrlResponse generateUploadUrl(String ticketNumber,
                                           String fileName,
                                           String contentType);

    /**
     * Generates a pre-signed GET URL for viewing a stored object.
     * Always generated fresh
     */
    String generateViewUrl(String s3Key);

    /**
     * Validates that the given s3Key belongs to the expected ticket.
     * Prevents tenants from confirming uploads to other tickets' folders.
     */
    boolean isValidKeyForTicket(String s3Key, String ticketId);
}
