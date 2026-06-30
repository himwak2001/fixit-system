package com.app.common.mapper;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.entity.User;
import com.app.ticket.dto.TechnicianSummaryDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class UserMapper {
    public void mapUserProfileDtoToUser(UserProfileDTO dto, User user) {
        user.setId(generateUUID());
        user.setKeycloakId(dto.getKeycloakId());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setPhone(dto.getPhone());
        user.setCreatedAt(LocalDateTime.now());
    }

    public TechnicianSummaryDTO mapUserToTechnicianSummaryDto(User user) {
        return TechnicianSummaryDTO.builder()
                .id(user.getKeycloakId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .specialization(user.getSpecialization()).build();
    }

    private UUID generateUUID() {
        return UUID.randomUUID();
    }
}
