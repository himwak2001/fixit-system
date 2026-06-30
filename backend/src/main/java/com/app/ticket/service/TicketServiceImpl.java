package com.app.ticket.service;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.entity.User;
import com.app.auth.entity.UserRole;
import com.app.auth.repository.IUserRepository;
import com.app.common.exception.BusinessRuleException;
import com.app.common.exception.ResourceNotFoundException;
import com.app.common.exception.UnauthorizedAccessException;
import com.app.common.mapper.UserMapper;
import com.app.common.util.AuthenticationUtil;
import com.app.ticket.dto.*;
import com.app.ticket.entity.Ticket;
import com.app.ticket.entity.TicketStatus;
import com.app.ticket.mapper.TicketMapper;
import com.app.ticket.repository.ITicketAttachmentRepository;
import com.app.ticket.repository.ITicketCommentRepository;
import com.app.ticket.repository.ITicketRepository;
import com.app.ticket.specification.TicketSpecification;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    private final UserMapper userMapper;
    private Map<TicketStatus, Set<TicketStatus>> statusTransition;

    @PostConstruct
    void init() {
        statusTransition = new EnumMap<>(TicketStatus.class);
        statusTransition.put(TicketStatus.OPEN, EnumSet.of(TicketStatus.ASSIGNED));
        statusTransition.put(TicketStatus.ASSIGNED, EnumSet.of(TicketStatus.IN_PROGRESS));
        statusTransition.put(TicketStatus.IN_PROGRESS, EnumSet.of(TicketStatus.RESOLVED));
        statusTransition.put(TicketStatus.RESOLVED, EnumSet.of(TicketStatus.CLOSED, TicketStatus.IN_PROGRESS));
        statusTransition.put(TicketStatus.CLOSED, EnumSet.noneOf(TicketStatus.class));
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "ticket:list", allEntries = true),
            @CacheEvict(value = "ticket:technicianTickets", allEntries = true),
            @CacheEvict(value = "ticket:info", allEntries = true),
            @CacheEvict(value = "ticket:admin", allEntries = true),
            @CacheEvict(value = "ticket:dashboard", allEntries = true),
            @CacheEvict(value = "ticket:technicians", allEntries = true)
    })
    public TicketSummaryDTO createTicket(TicketCreateRequest request) {
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
        Ticket savedTicket = ticketRepository.save(newTicket);

        return mapper.mapTicketToSummaryDto(savedTicket);
    }

    @Override
    @Cacheable(value = "ticket:list", keyGenerator = "ticketListKeyGenerator")
    public PagedResponse<TicketSummaryDTO> getMyTickets(int pageNumber, int pageSize, String status, String category, String priority) {
        // get user from authentication object
        UserProfileDTO userDto = authenticationUtil.getUserFromSecurityContext();

        // Build Specifications
        Specification<Ticket> spec = Specification.allOf(
                ticketSpecification.hasCreatedById(userDto.getKeycloakId()),
                ticketSpecification.hasStatus(status),
                ticketSpecification.hasCategory(category),
                ticketSpecification.hasPriority(priority)
        );

        // Build pageable
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        // Fetch and Map
        Page<Ticket> ticketPage = ticketRepository.findAll(spec, pageable);

        return mapper.mapTicketToPagedTicketDetails(ticketPage);
    }

    @Override
    @Cacheable(value = "ticket:info", key = "#ticketNumber")
    public TicketDetailDto getTicketDetails(String ticketNumber) {
        // fetch ticket and its comments and attachments details
        Optional<Ticket> ticket = ticketRepository.findByTicketNumber(ticketNumber);
        if (ticket.isEmpty()) {
            throw new ResourceNotFoundException("Ticket", "ticket number", ticketNumber);
        }
        List<CommentResponse> comments = commentRepository.findDtoByTicketNumber(ticketNumber);
        List<AttachmentResponse> attachments = attachmentRepository.findDtoByTicketNumber(ticketNumber);

        return mapper.mapTicketToDetailDto(ticket.get(), comments, attachments);
    }

    @Override
    // @Cacheable(value = "ticket:technicianTickets", key = "'technicianAssignTickets'")
    public PagedResponse<TicketSummaryDTO> getTechnicianAssignedTicket(int pageNumber, int pageSize, String status) {
        // get user from authentication object
        UserProfileDTO userDto = authenticationUtil.getUserFromSecurityContext();
        Optional<User> user = userRepository.findByKeycloakId(userDto.getKeycloakId());
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User", "keycloak id", userDto.getKeycloakId());
        }

        // Build Specifications
        Specification<Ticket> spec = Specification.allOf(
                ticketSpecification.hasAssignedToId(user.get().getId()),
                ticketSpecification.hasStatus(status)
        );

        // Build pageable
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        // Fetch and Map
        Page<Ticket> ticketPage = ticketRepository.findAll(spec, pageable);

        return mapper.mapTicketToPagedTicketDetails(ticketPage);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "ticket:list", allEntries = true),
            @CacheEvict(value = "ticket:technicianTickets", allEntries = true),
            @CacheEvict(value = "ticket:info", allEntries = true),
            @CacheEvict(value = "ticket:admin", allEntries = true),
            @CacheEvict(value = "ticket:dashboard", allEntries = true),
            @CacheEvict(value = "ticket:technicians", allEntries = true)
    })
    public TicketSummaryDTO startTicketByTechnician(String ticketNumber) {
        TicketSummaryDTO ticket = transitionTicketStatus(ticketNumber, TicketStatus.IN_PROGRESS);
        return ticket;
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "ticket:list", allEntries = true),
            @CacheEvict(value = "ticket:technicianTickets", allEntries = true),
            @CacheEvict(value = "ticket:info", allEntries = true),
            @CacheEvict(value = "ticket:admin", allEntries = true),
            @CacheEvict(value = "ticket:dashboard", allEntries = true),
            @CacheEvict(value = "ticket:technicians", allEntries = true)
    })
    public TicketSummaryDTO resolveTicketByTechnician(String ticketNumber) {
        TicketSummaryDTO ticket = transitionTicketStatus(ticketNumber, TicketStatus.RESOLVED);
        return ticket;
    }

    @Override
    // @Cacheable(value = "ticket:list", keyGenerator = "ticketListKeyGenerator")
    public PagedResponse<TicketSummaryDTO> getTickets(int pageNumber, int pageSize, String status, String category, String priority, LocalDateTime startDate, LocalDateTime endDate) {
        // Build Specifications
        Specification<Ticket> spec = Specification.allOf(
                ticketSpecification.hasStatus(status),
                ticketSpecification.hasCategory(category),
                ticketSpecification.hasPriority(priority),
                ticketSpecification.hasCreatedBetween(startDate, endDate)
        );

        // Build pageable
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        // Fetch and Map
        Page<Ticket> ticketPage = ticketRepository.findAll(spec, pageable);

        return mapper.mapTicketToPagedTicketDetails(ticketPage);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "ticket:list", allEntries = true),
            @CacheEvict(value = "ticket:technicianTickets", allEntries = true),
            @CacheEvict(value = "ticket:info", allEntries = true),
            @CacheEvict(value = "ticket:admin", allEntries = true),
            @CacheEvict(value = "ticket:dashboard", allEntries = true),
            @CacheEvict(value = "ticket:technicians", allEntries = true)
    })
    public TicketSummaryDTO assignTicketToTechnician(AssignTicketRequest assignRequest) {
        // Fetch ticket and validate existence
        Ticket savedTicket = ticketRepository.findByTicketNumber(assignRequest.getTicketNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticket number", assignRequest.getTicketNumber()));

        // Get user and validate existence
        User user = userRepository.findByKeycloakId(assignRequest.getAssigneeId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "keycloak id", assignRequest.getAssigneeId()));

        savedTicket.setAssignedTo(user);
        savedTicket.setStatus(TicketStatus.ASSIGNED);
        savedTicket.setUpdatedAt(LocalDateTime.now());
        Ticket updatedTicket = ticketRepository.save(savedTicket);
        return mapper.mapTicketToSummaryDto(updatedTicket);
    }

    @Override
    @Cacheable(value = "ticket:technicians", key = "'all'")
    public List<TechnicianSummaryDTO> getTechnicianWithSpecialization() {
        List<User> technicians = userRepository.findByRole(UserRole.TECHNICIAN);
        return technicians.stream()
                .map(userMapper::mapUserToTechnicianSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "ticket:list", allEntries = true),
            @CacheEvict(value = "ticket:technicianTickets", allEntries = true),
            @CacheEvict(value = "ticket:info", allEntries = true),
            @CacheEvict(value = "ticket:admin", allEntries = true),
            @CacheEvict(value = "ticket:dashboard", allEntries = true),
            @CacheEvict(value = "ticket:technicians", allEntries = true)
    })
    public TicketSummaryDTO closeTicket(String ticketNumber) {
        // Fetch ticket and validate existence
        Ticket savedTicket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticket number", ticketNumber));

        // State Machine Check: Is the transition valid?
        Set<TicketStatus> validNextStatus = statusTransition.getOrDefault(savedTicket.getStatus(), Collections.emptySet());
        if (!validNextStatus.contains(TicketStatus.CLOSED)) {
            throw new BusinessRuleException(String.format(
                    "Invalid status transition. Cannot move ticket from %s to %s.",
                    savedTicket.getStatus(),
                    TicketStatus.CLOSED.name()
            ));
        }

        savedTicket.setStatus(TicketStatus.CLOSED);
        savedTicket.setUpdatedAt(LocalDateTime.now());
        Ticket persisted = ticketRepository.save(savedTicket);
        return mapper.mapTicketToSummaryDto(persisted);
    }


    private TicketSummaryDTO transitionTicketStatus(String ticketNumber, TicketStatus targetStatus) {
        // Get user and validate existence
        UserProfileDTO userDto = authenticationUtil.getUserFromSecurityContext();
        User user = userRepository.findByKeycloakId(userDto.getKeycloakId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "keycloak id", userDto.getKeycloakId()));

        // Fetch ticket and validate existence
        Ticket savedTicket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticket number", ticketNumber));

        // State Machine Check: Is the transition valid?
        Set<TicketStatus> validNextStatus = statusTransition.getOrDefault(savedTicket.getStatus(), Collections.emptySet());
        if (!validNextStatus.contains(targetStatus)) {
            throw new BusinessRuleException(String.format(
                    "Invalid status transition. Cannot move ticket from %s to %s.",
                    savedTicket.getStatus(),
                    targetStatus
            ));
        }

        // Ownership check: Is the caller the technician assigned to this ticket?
        if (savedTicket.getAssignedTo() == null || !savedTicket.getAssignedTo().equals(user)) {
            throw new UnauthorizedAccessException("You are not the technician assigned to this ticket.");
        }

        // Update state and save
        savedTicket.setStatus(targetStatus);
        savedTicket.setUpdatedAt(LocalDateTime.now());
        Ticket updatedTicket = ticketRepository.save(savedTicket);
        return mapper.mapTicketToSummaryDto(updatedTicket);
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
