package com.app.ticket.service;

import com.app.ticket.dto.*;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ITicketService {
    // method to create the ticket
    String createTicket(TicketCreateRequest request);

    // method to get tenant's created tickets
    Page<TicketResponseDTO> getMyTickets(int pageNumber, int pageSize, String status, String category);

    // method to get tenant's ticket summary
    TicketSummaryDTO getTicketDetails(String ticketNumber);

    // method to get technician's assigned ticket
    List<TicketResponseDTO> getTechnicianAssignedTicket(String status);

    // method to start the ticket by technician
    void startTicketByTechnician(String ticketNumber);

    // method to resolve ticket by technician
    void resolveTicketByTechnician(String ticketNumber);

    // method to get all tickets by admin
    Page<TicketResponseDTO> getTickets(int pageNumber, int pageSize, String status, String category, String priority, LocalDateTime startDate, LocalDateTime endDate);

    // method to assign ticket to technician
    void assignTicketToTechnician(AssignTicketRequest assignRequest);

    // method to get technician's list
    List<TechnicianDto> getTechnicianWithSpecialization();

    // method to close ticket by tenant
    void closeTicket(String ticketNumber);
}
