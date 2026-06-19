package com.app.ticket.specification;

import com.app.ticket.entity.Ticket;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TicketSpecification {
    // Filter by User ID
    public Specification<Ticket> hasCreatedById(String userId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("createdBy").get("keycloakId"), userId);
    }

    // Filter by Status
    public Specification<Ticket> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status.trim().toUpperCase());
    }

    // Filter by Category
    public Specification<Ticket> hasCategory(String category) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category"), category.trim().toUpperCase());
    }
}
