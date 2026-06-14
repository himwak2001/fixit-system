package com.app.auth.dto;

import com.app.auth.entity.UserRole;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserProfileDTO {
    private String keycloakId;
    private String fullName;
    private String email;
    private UserRole role;
    private String phone;
}
