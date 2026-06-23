package com.app.ticket.service;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.entity.User;
import com.app.auth.entity.UserRole;
import com.app.auth.repository.IUserRepository;
import com.app.auth.service.UserServiceImpl;
import com.app.common.exception.BusinessRuleException;
import com.app.common.exception.ResourceNotFoundException;
import com.app.common.exception.UnauthorizedAccessException;
import com.app.common.util.AuthenticationUtil;
import com.app.ticket.dto.*;
import com.app.ticket.entity.Ticket;
import com.app.ticket.entity.TicketAttachment;
import com.app.ticket.entity.TicketStatus;
import com.app.ticket.repository.ITicketAttachmentRepository;
import com.app.ticket.repository.ITicketRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketAttachmentServiceImpl implements ITicketAttachmentService {
    private static final int MAX_ATTACHMENTS_PER_TICKET = 3;
    private final IFileStorageService fileStorageService;
    private final ITicketAttachmentRepository attachmentRepository;
    private final ITicketRepository ticketRepository;
    private final IUserRepository userRepository;
    private final AuthenticationUtil authenticationUtil;


    @Override
    public PresignedUrlResponse generateUploadUrl(String ticketNumber, PresignedUrlRequest request) {
        // resolve ticket
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber).orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticket number", ticketNumber));

        // resolve current user
        UserProfileDTO dto = authenticationUtil.getUserFromSecurityContext();
        User user = userRepository.findByKeycloakId(dto.getKeycloakId()).orElseThrow(() -> new ResourceNotFoundException("User", "keycloak id", dto.getKeycloakId()));

        // ownership check - only creator or assigned technician can upload
        validateUploadPermission(ticket, user);

        // can't upload to a closed/resolved ticket
        if (ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.CLOSED) {
            throw new BusinessRuleException("Cannot upload attachments to a " + ticket.getStatus() + " ticket");
        }

        int existingCount = attachmentRepository.countByTicketNumber(ticketNumber);
        if (existingCount >= MAX_ATTACHMENTS_PER_TICKET) {
            throw new BusinessRuleException(
                    "Maximum " + MAX_ATTACHMENTS_PER_TICKET + " attachments allowed per ticket"
            );
        }

        return fileStorageService.generateUploadUrl(ticketNumber, request.getFileName(), request.getContentType());
    }

    @Override
    @Transactional
    public AttachmentResponse confirmUpload(String ticketNumber, AttachmentConfirmRequest request) {
        // resolve ticket
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber).orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticket number", ticketNumber));

        // resolve current user
        UserProfileDTO dto = authenticationUtil.getUserFromSecurityContext();
        User user = userRepository.findByKeycloakId(dto.getKeycloakId()).orElseThrow(() -> new ResourceNotFoundException("User", "keycloak id", dto.getKeycloakId()));

        // ownership check - only creator or assigned technician can upload
        validateUploadPermission(ticket, user);

        // Validate key belongs to this ticket — prevents key injection
        if (!fileStorageService.isValidKeyForTicket(request.getS3Key(), ticketNumber)) {
            throw new BusinessRuleException("Invalid S3 key for this ticket");
        }

        // Guard against duplicate confirm calls
        if (attachmentRepository.existsByS3Key(request.getS3Key())) {
            throw new BusinessRuleException("This file has already been confirmed");
        }

        int existingCount = attachmentRepository.countByTicketNumber(ticketNumber);
        if (existingCount >= MAX_ATTACHMENTS_PER_TICKET) {
            throw new BusinessRuleException("Maximum " + MAX_ATTACHMENTS_PER_TICKET + " attachments already reached");
        }

        TicketAttachment attachment = TicketAttachment.builder()
                .id(UUID.randomUUID())
                .ticket(ticket)
                .s3Key(request.getS3Key())
                .fileName(request.getFileName())
                .user(user)
                .uploadedAt(LocalDateTime.now())
                .build();

        TicketAttachment saved = attachmentRepository.save(attachment);

        log.info("Attachment confirmed — ticketId={}, s3Key={}", ticketNumber, request.getS3Key());

        return toResponse(saved, user.getFullName());
    }

    @Override
    @Transactional
    public ViewUrlResponse getViewUrl(String ticketNumber, UUID attachmentId) {
        // resolve ticket
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber).orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticket number", ticketNumber));

        // resolve current user
        UserProfileDTO dto = authenticationUtil.getUserFromSecurityContext();
        User user = userRepository.findByKeycloakId(dto.getKeycloakId()).orElseThrow(() -> new ResourceNotFoundException("User", "keycloak id", dto.getKeycloakId()));

        validateViewPermission(ticket, user);

        TicketAttachment attachment = attachmentRepository.findById(attachmentId).orElseThrow(() -> new ResourceNotFoundException("TicketAttachment", "id", attachmentId.toString()));

        // Ensure attachment belongs to this ticket
        if (!attachment.getTicket().getId().equals(ticket.getId())) {
            throw new UnauthorizedAccessException("Attachment does not belong to this ticket");
        }

        String viewUrl = fileStorageService.generateViewUrl(attachment.getS3Key());

        return ViewUrlResponse.builder()
                .viewUrl(viewUrl)
                .expiresInSeconds(15 * 60L)
                .build();
    }

    private void validateUploadPermission(Ticket ticket, User user) {
        boolean isCreator = ticket.getCreatedBy().getId().equals(user.getId());
        boolean isAssignedTechnician = ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        if (!isCreator && !isAssignedTechnician && !isAdmin) {
            throw new UnauthorizedAccessException(
                    "You do not have permission to upload to this ticket"
            );
        }
    }

    private void validateViewPermission(Ticket ticket, User user) {
        boolean isCreator = ticket.getCreatedBy().getId().equals(user.getId());
        boolean isAssignedTechnician = ticket.getAssignedTo() != null
                && ticket.getAssignedTo().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        if (!isCreator && !isAssignedTechnician && !isAdmin) {
            throw new UnauthorizedAccessException(
                    "You do not have permission to view attachments for this ticket"
            );
        }
    }

    private AttachmentResponse toResponse(TicketAttachment attachment,
                                          String uploaderName) {
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .uploadedBy(uploaderName)
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }
}
