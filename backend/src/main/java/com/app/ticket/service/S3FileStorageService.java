package com.app.ticket.service;

import com.app.ticket.dto.PresignedUrlResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3FileStorageService implements IFileStorageService {
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.presigned-url-expiry-minutes}")
    private long uploadExpiryMinutes;

    @Value("${aws.s3.presigned-view-url-expiry-minutes}")
    private long viewExpiryMinutes;

    /**
     * Generates a pre-signed PUT URL for direct client-to-S3 upload.
     * Returns the URL and the S3 key to be stored after upload confirmation.
     *
     * @param ticketNumber
     * @param fileName
     * @param contentType
     */
    @Override
    public PresignedUrlResponse generateUploadUrl(String ticketNumber, String fileName, String contentType) {
        // build the s3 key - tickets/{ticketNumber}/{uuid}-{fileName}
        String s3Key = buildS3Key(ticketNumber, fileName);

        // Build the put object request that the pre-signed URL will authorize
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .contentType(contentType)
                .build();

        // Wrap it in a pre-sign request with expiry
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(uploadExpiryMinutes))
                .putObjectRequest(putObjectRequest)
                .build();

        // Generate the URL
        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);

        String uploadUrl = presignedRequest.url().toString();

        log.info("Generated pre-signed upload URL for ticketId={}, key={}", ticketNumber, s3Key);

        return PresignedUrlResponse.builder()
                .uploadUrl(uploadUrl)
                .s3Key(s3Key)
                .expiresInSeconds(uploadExpiryMinutes * 60)
                .build();
    }

    /**
     * Generates a pre-signed GET URL for viewing a stored object.
     * Always generated fresh
     *
     * @param s3Key
     */
    @Override
    public String generateViewUrl(String s3Key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(viewExpiryMinutes))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);

        return presignedRequest.url().toString();
    }

    /**
     * Validates that the given s3Key belongs to the expected ticket.
     * Prevents tenants from confirming uploads to other tickets' folders.
     *
     * @param s3Key
     * @param ticketNumber
     */
    @Override
    public boolean isValidKeyForTicket(String s3Key, String ticketNumber) {
        // Key must start with tickets/{ticketId}/
        String expectedPrefix = "tickets/" + ticketNumber + "/";
        return s3Key != null && s3Key.startsWith(expectedPrefix);
    }

    private String buildS3Key(String ticketNumber, String fileName) {
        String uuid = UUID.randomUUID().toString();
        String sanitized = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        return "tickets/" + ticketNumber + "/" + uuid + "-" + sanitized;
    }
}
