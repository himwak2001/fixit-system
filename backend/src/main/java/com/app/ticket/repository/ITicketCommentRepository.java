package com.app.ticket.repository;

import com.app.ticket.dto.CommentResponse;
import com.app.ticket.entity.TicketComment;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ITicketCommentRepository extends JpaRepository<TicketComment, UUID> {
    List<TicketComment> findByTicketTicketNumber(String ticketNumber);

    @Query("""
            SELECT new com.app.ticket.dto.CommentResponse(
                    c.id, c.comment, u.fullName, c.createdAt, STR(u.role)
                )
                FROM TicketComment c
                JOIN c.user u
                JOIN c.ticket t
                WHERE t.ticketNumber = :ticketNumber
            """)
    List<CommentResponse> findDtoByTicketNumber(@Param("ticketNumber") String ticketNumber);


}
