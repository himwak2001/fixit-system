package com.app.common.mapper;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.entity.User;
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

    private UUID generateUUID() {
        return UUID.randomUUID();
    }
}
