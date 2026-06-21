package com.app.ticket.specification;

import com.app.ticket.entity.Ticket;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class TicketSpecification {
    // Filter by created date
    public Specification<Ticket> hasCreatedBetween(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return (root, query, criteriaBuilder) -> {
            // No dates provided - skip condition entirely
            if (startDateTime == null && endDateTime == null) {
                return null;
            }

            // Only startDateTime provided (Find everything from this timestamp forward)
            if (startDateTime != null && endDateTime == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDateTime);
            }

            // Only endDateTime provided (Find everything up to this exact timestamp)
            if (startDateTime == null && endDateTime != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDateTime);
            }

            // Complete timestamp boundary match
            return criteriaBuilder.between(root.get("createdAt"), startDateTime, endDateTime);
        };
    }

    // Filter by User ID
    public Specification<Ticket> hasCreatedById(String userId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("createdBy").get("keycloakId"), userId);
    }

    // Filter by Assignee Id
    public Specification<Ticket> hasAssignedToId(UUID userId){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("assignedTo").get("id"), userId);
    }

    // Filter by Status
    public Specification<Ticket> hasStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return null;
        }
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status.trim().toUpperCase());
    }

    // Filter by Category
    public Specification<Ticket> hasCategory(String category) {
        if (!StringUtils.hasText(category)) {
            return null;
        }
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category"), category.trim().toUpperCase());
    }

    // Filter by Priority
    public Specification<Ticket> hasPriority(String priority) {
        if (!StringUtils.hasText(priority)) {
            return null;
        }
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("priority"), priority.trim().toUpperCase());
    }
}
