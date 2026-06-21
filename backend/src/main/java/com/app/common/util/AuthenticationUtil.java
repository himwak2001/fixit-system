package com.app.common.util;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.entity.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AuthenticationUtil {
    public UserProfileDTO getUserFromSecurityContext() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) {
            throw new RuntimeException("Unable to get authenticated user details!");
        }

        Map<String, Object> claims = jwt.getClaims();

        UserRole userRole = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(String::toUpperCase)
                .filter(role -> role.contains("ROLE_TENANT") || role.contains("ROLE_TECHNICIAN") || role.contains("ROLE_ADMIN"))
                .findFirst()
                .map(this::mapToRoleEnum)
                .orElse(UserRole.TENANT);

        return UserProfileDTO.builder()
                .keycloakId((String) claims.get("sub"))
                .fullName((String) claims.get("name"))
                .email((String) claims.get("email"))
                .role(userRole)
                .build();
    }

    private UserRole mapToRoleEnum(String authority) {
        String role = authority.replace("ROLE_", "");
        return UserRole.valueOf(role);
    }
}
