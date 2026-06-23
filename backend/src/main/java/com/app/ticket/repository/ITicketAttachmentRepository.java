package com.app.ticket.repository;

import com.app.ticket.dto.AttachmentDto;
import com.app.ticket.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ITicketAttachmentRepository extends JpaRepository<TicketAttachment, UUID> {
    List<TicketAttachment> findByTicketTicketNumber(String ticketNumber);

    @Query("""
            SELECT new com.app.ticket.dto.AttachmentDto(
                    a.id, a.fileName, a.s3Key, a.uploadedAt
                )
                FROM TicketAttachment a
                JOIN a.user u
                JOIN a.ticket t
                WHERE t.ticketNumber = :ticketNumber
            """)
    List<AttachmentDto> findDtoByTicketNumber(String ticketNumber);

    @Query("""
             SELECT a
             FROM TicketAttachment a
             JOIN a.ticket t
             WHERE t.ticketNumber = :ticketNumber
            """)
    List<TicketAttachment> findByTicketNumber(String ticketNumber);

    @Query("""
             SELECT COUNT(a)
             FROM TicketAttachment a
             JOIN a.ticket t
             WHERE t.ticketNumber = :ticketNumber
            """)
    int countByTicketNumber(String ticketNumber);

    boolean existsByS3Key(String s3Key);
}
