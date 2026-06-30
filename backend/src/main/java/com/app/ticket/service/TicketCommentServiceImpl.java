package com.app.ticket.service;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.entity.User;
import com.app.auth.entity.UserRole;
import com.app.auth.repository.IUserRepository;
import com.app.common.exception.BusinessRuleException;
import com.app.common.exception.ResourceNotFoundException;
import com.app.common.exception.UnauthorizedAccessException;
import com.app.common.util.AuthenticationUtil;
import com.app.ticket.dto.CommentRequest;
import com.app.ticket.dto.CommentResponse;
import com.app.ticket.entity.Ticket;
import com.app.ticket.entity.TicketComment;
import com.app.ticket.entity.TicketStatus;
import com.app.ticket.mapper.TicketMapper;
import com.app.ticket.repository.ITicketCommentRepository;
import com.app.ticket.repository.ITicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketCommentServiceImpl implements ITicketCommentService {
    private final AuthenticationUtil authenticationUtil;
    private final ITicketCommentRepository commentRepository;
    private final ITicketRepository ticketRepository;
    private final IUserRepository userRepository;
    private final TicketMapper ticketMapper;

    @Override
    @Caching(evict = {
            @CacheEvict(value = "ticket:list", allEntries = true),
            @CacheEvict(value = "ticket:technicianTickets", allEntries = true),
            @CacheEvict(value = "ticket:info", allEntries = true),
            @CacheEvict(value = "ticket:admin", allEntries = true),
            @CacheEvict(value = "ticket:dashboard", allEntries = true),
            @CacheEvict(value = "ticket:technicians", allEntries = true)
    })
    public CommentResponse addComment(String ticketNumber, CommentRequest request) {
        // resolve ticket
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber).orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticket number", ticketNumber));

        // resolve current user
        UserProfileDTO dto = authenticationUtil.getUserFromSecurityContext();
        User user = userRepository.findByKeycloakId(dto.getKeycloakId()).orElseThrow(() -> new ResourceNotFoundException("User", "keycloak id", dto.getKeycloakId()));

        // validate ticket is not closed
        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new BusinessRuleException("Cannot add comments to a CLOSED ticket");
        }

        // role based validation - each role can only comment on tickets they are involved with
        validateCommentPermission(ticket, user);

        TicketComment comment = TicketComment.builder()
                .id(UUID.randomUUID())
                .ticket(ticket)
                .user(user)
                .comment(request.getComment().trim())
                .createdAt(LocalDateTime.now())
                .build();

        TicketComment saved = commentRepository.save(comment);

        log.info("Comment added — ticketNumber={}, userId={}, role={}", ticketNumber, user.getKeycloakId(), user.getRole().name());

        return ticketMapper.toResponse(saved);
    }

    @Override
    @Cacheable(value = "ticket:admin", key = "#ticketNumber")
    public List<CommentResponse> getComments(String ticketNumber) {
        // resolve ticket
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber).orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticket number", ticketNumber));

        // resolve current user
        UserProfileDTO dto = authenticationUtil.getUserFromSecurityContext();
        User user = userRepository.findByKeycloakId(dto.getKeycloakId()).orElseThrow(() -> new ResourceNotFoundException("User", "keycloak id", dto.getKeycloakId()));

        validateCommentPermission(ticket, user);

        return commentRepository.findDtoByTicketNumber(ticketNumber);
    }

    private void validateCommentPermission(Ticket ticket, User user) {
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        boolean isCreator = ticket.getCreatedBy().getId().equals(user.getId());

        boolean isAssignedTechnician = ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(user.getId());

        if (!isAdmin && !isCreator && !isAssignedTechnician) {
            throw new UnauthorizedAccessException("You do not have permission to comment on this ticket");
        }
    }
}
