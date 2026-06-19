package com.app.ticket.service;

import com.app.ticket.dto.TicketCreateRequest;
import com.app.ticket.dto.TicketResponseDTO;
import com.app.ticket.dto.TicketSummaryDTO;
import org.springframework.data.domain.Page;

public interface ITicketService {
    // method to create the ticket
    String createTicket(TicketCreateRequest request);

    // method to get tenant's created tickets
    Page<TicketResponseDTO> getMyTickets(int pageNumber, int pageSize, String status, String category);

    // method to get tenant's ticket summary
    TicketSummaryDTO getTicketDetails(String ticketNumber);
}
