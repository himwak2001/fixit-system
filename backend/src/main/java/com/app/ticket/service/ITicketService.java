package com.app.ticket.service;

import com.app.ticket.dto.*;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

public interface ITicketService {
    // method to create the ticket
    TicketSummaryDTO createTicket(TicketCreateRequest request);

    // method to get tenant's created tickets
    PagedResponse<TicketSummaryDTO> getMyTickets(int pageNumber, int pageSize, String status, String category, String priority);

    // method to get tenant's ticket summary
    TicketDetailDto getTicketDetails(String ticketNumber);

    // method to get technician's assigned ticket
    PagedResponse<TicketSummaryDTO> getTechnicianAssignedTicket(int pageNumber, int pageSize, String status);

    // method to start the ticket by technician
    TicketSummaryDTO startTicketByTechnician(String ticketNumber);

    // method to resolve ticket by technician
    TicketSummaryDTO resolveTicketByTechnician(String ticketNumber);

    // method to get all tickets by admin
    PagedResponse<TicketSummaryDTO> getTickets(int pageNumber, int pageSize, String status, String category, String priority, LocalDateTime startDate, LocalDateTime endDate);

    // method to assign ticket to technician
    TicketSummaryDTO assignTicketToTechnician(AssignTicketRequest assignRequest);

    // method to get technician's list
    List<TechnicianSummaryDTO> getTechnicianWithSpecialization();

    // method to close ticket by tenant
    TicketSummaryDTO closeTicket(String ticketNumber);
}
