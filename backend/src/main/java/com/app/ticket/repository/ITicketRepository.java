package com.app.ticket.repository;

import com.app.ticket.entity.Ticket;
import com.app.ticket.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ITicketRepository extends JpaRepository<Ticket, UUID>, JpaSpecificationExecutor<Ticket> {
    Optional<Ticket> findByTicketNumber(String ticketNumber);

    // Count tickets per status — returns list of [status, count] pairs
    @Query("SELECT t.status, COUNT(t) FROM Ticket t GROUP BY t.status")
    List<Object[]> countGroupByStatus();

    // Count tickets per category
    @Query("SELECT t.category, COUNT(t) FROM Ticket t GROUP BY t.category")
    List<Object[]> countGroupByCategory();

    // Count tickets per priority
    @Query("SELECT t.priority, COUNT(t) FROM Ticket t GROUP BY t.priority")
    List<Object[]> countGroupByPriority();

    // Count by specific status — used for individual stat cards
    long countByStatus(TicketStatus status);
}
