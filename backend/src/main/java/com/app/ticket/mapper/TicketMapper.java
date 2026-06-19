package com.app.ticket.mapper;

import com.app.ticket.dto.TicketCreateRequest;
import com.app.ticket.dto.TicketResponseDTO;
import com.app.ticket.entity.Ticket;
import com.app.ticket.entity.TicketCategory;
import com.app.ticket.entity.TicketPriority;
import com.app.ticket.entity.TicketStatus;
import org.springframework.stereotype.Component;

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
}
