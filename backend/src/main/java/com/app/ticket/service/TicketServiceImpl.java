package com.app.ticket.service;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.entity.User;
import com.app.auth.repository.IUserRepository;
import com.app.common.exception.ResourceNotFoundException;
import com.app.common.util.AuthenticationUtil;
import com.app.ticket.dto.*;
import com.app.ticket.entity.Ticket;
import com.app.ticket.entity.TicketAttachment;
import com.app.ticket.entity.TicketComment;
import com.app.ticket.mapper.TicketMapper;
import com.app.ticket.repository.ITicketAttachmentRepository;
import com.app.ticket.repository.ITicketCommentRepository;
import com.app.ticket.repository.ITicketRepository;
import com.app.ticket.specification.TicketSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements ITicketService {
    private static final String REDIS_KEY = "ticket:counter";
    private final ITicketRepository ticketRepository;
    private final ITicketCommentRepository commentRepository;
    private final ITicketAttachmentRepository attachmentRepository;
    private final IUserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final AuthenticationUtil authenticationUtil;
    private final TicketSpecification ticketSpecification;
    private final TicketMapper mapper;

    @Transactional
    @Override
    public String createTicket(TicketCreateRequest request) {
        // get the user
        UserProfileDTO userDto = authenticationUtil.getUserFromSecurityContext();
        Optional<User> user = userRepository.findByKeycloakId(userDto.getKeycloakId());
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User", "keycloak id", userDto.getKeycloakId());
        }

        // create ticket object
        Ticket newTicket = new Ticket();
        String ticketNumber = generateTicketNumber();
        mapper.mapTicketRequestToTicket(request, newTicket, "create");
        newTicket.setTicketNumber(ticketNumber);
        newTicket.setId(UUID.randomUUID());
        newTicket.setCreatedBy(user.get());
        newTicket.setCreatedAt(LocalDateTime.now());

        // save to the db
        ticketRepository.save(newTicket);

        return ticketNumber;
    }

    @Override
    @Cacheable(value = "tickets:list", keyGenerator = "ticketListKeyGenerator")
    public Page<TicketResponseDTO> getMyTickets(int pageNumber, int pageSize, String status, String category) {
        // get user from authentication object
        UserProfileDTO userDto = authenticationUtil.getUserFromSecurityContext();

        // Build Specifications
        Specification<Ticket> spec = Specification.allOf(
                ticketSpecification.hasCreatedById(userDto.getKeycloakId()),
                ticketSpecification.hasStatus(status),
                ticketSpecification.hasCategory(category)
        );

        // Build pageable
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        // Fetch and Map
        Page<Ticket> ticketPage = ticketRepository.findAll(spec, pageable);

        return ticketPage.map(mapper::mapTicketToResponseDto);
    }

    @Override
    @Cacheable(value = "ticket:info", key = "#ticketNumber")
    public TicketSummaryDTO getTicketDetails(String ticketNumber) {
        // fetch ticket and its comments and attachments details
        Optional<Ticket> ticket = ticketRepository.findByTicketNumber(ticketNumber);
        if (ticket.isEmpty()) {
            throw new ResourceNotFoundException("Ticket", "ticket number", ticketNumber);
        }
        TicketResponseDTO ticketDto = mapper.mapTicketToResponseDto(ticket.get());
        List<CommentDto> comments = commentRepository.findDtoByTicketNumber(ticketNumber);
        List<AttachmentDto> attachments = attachmentRepository.findDtoByTicketNumber(ticketNumber);

        // generate the pre-signed URL field for each DTO in place
        /*
        dtos.forEach(dto -> {
            String presignedUrl = storageService.generatePreSignedUrl(dto.getS3Key());
            dto.setUrl(presignedUrl);
        });
        * */

        return new TicketSummaryDTO(ticketDto, comments, attachments);
    }


    private String generateTicketNumber() {
        int currentYear = LocalDate.now().getYear();
        Long nextSequence = redisTemplate.opsForValue().increment(REDIS_KEY);
        if (nextSequence == null) {
            throw new IllegalStateException("Failed to generate ticket number: Redis counter returned null.");
        }
        return String.format("TKT-%d-%05d", currentYear, nextSequence);
    }
}
