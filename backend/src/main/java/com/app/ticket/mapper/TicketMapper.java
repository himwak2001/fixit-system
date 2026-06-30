package com.app.ticket.mapper;

import com.app.ticket.dto.*;
import com.app.ticket.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TicketMapper {
    public void mapTicketRequestToTicket(TicketCreateRequest request, Ticket ticket, String type) {
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(TicketCategory.valueOf(request.getCategory().trim().toUpperCase()));
        ticket.setPriority(TicketPriority.valueOf(request.getPriority().trim().toUpperCase()));
        ticket.setLocation(request.getLocation());
        if (type.equals("create")) {
            ticket.setStatus(TicketStatus.OPEN);
        } else {
            ticket.setStatus(TicketStatus.valueOf(request.getStatus().trim().toUpperCase()));
        }
    }

    public TicketSummaryDTO mapTicketToSummaryDto(Ticket ticket) {
        return TicketSummaryDTO.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .title(ticket.getTitle())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .location(ticket.getLocation())
                .createdByName(ticket.getCreatedBy().getFullName())
                .assignedToName(
                        ticket.getAssignedTo() != null
                                ? ticket.getAssignedTo().getFullName()
                                : "Unassigned"
                )
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt()).build();
    }

    public PagedResponse<TicketSummaryDTO> mapTicketToPagedTicketDetails(Page<Ticket> ticketPage) {
        Page<TicketSummaryDTO> summary = ticketPage.map(this::mapTicketToSummaryDto);
        return PagedResponse.<TicketSummaryDTO>builder()
                .content(summary.getContent())
                .page(summary.getNumber())
                .size(summary.getSize())
                .totalElements(summary.getTotalElements())
                .totalPages(summary.getTotalPages())
                .last(summary.isLast()).build();
    }

    public TicketDetailDto mapTicketToDetailDto(Ticket ticket, List<CommentResponse> comments, List<AttachmentResponse> attachments) {
        return TicketDetailDto.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .location(ticket.getLocation())
                .createdById(ticket.getCreatedBy().getId())
                .createdByName(ticket.getCreatedBy().getFullName())
                .assignedToId(
                        ticket.getAssignedTo() != null
                                ? ticket.getAssignedTo().getId()
                                : null
                )
                .assignedToName(ticket.getAssignedTo() != null
                        ? ticket.getAssignedTo().getFullName()
                        : "Unassigned")
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .comments(comments)
                .attachments(attachments).build();
    }

    public TicketResponseDTO mapTicketToResponseDto(Ticket ticket) {
        TicketResponseDTO responseDTO = new TicketResponseDTO();
        responseDTO.setTicketNumber(ticket.getTicketNumber());
        responseDTO.setTitle(ticket.getTitle());
        responseDTO.setDescription(ticket.getDescription());
        responseDTO.setCategory(ticket.getCategory().name());
        responseDTO.setPriority(ticket.getPriority().name());
        responseDTO.setLocation(ticket.getLocation());
        responseDTO.setStatus(ticket.getStatus().name());

        if (ticket.getAssignedTo() != null) responseDTO.setAssignedTo(ticket.getAssignedTo().getFullName());
        else responseDTO.setAssignedTo("");

        responseDTO.setCreatedAt(ticket.getCreatedAt());

        return responseDTO;
    }

    public CommentResponse toResponse(TicketComment comment) {
        return CommentResponse.builder()
                .commentId(comment.getId())
                .comment(comment.getComment())
                .commentedBy(comment.getUser().getFullName())
                .role(comment.getUser().getRole().name())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
