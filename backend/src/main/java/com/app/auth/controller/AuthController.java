package com.app.auth.controller;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.service.UserServiceImpl;
import com.app.common.constants.UserConstants;
import com.app.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping(path = "/api/v1/auth", produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AuthController {
    private final UserServiceImpl userService;

    /**
     * Syncs the currently authenticated Keycloak user with the database on their first login.
     * * @return a {@link ResponseEntity} containing the {@link ApiResponse} with the sync status and timestamp
     */
    @PostMapping(path = "/sync")
    public ResponseEntity<ApiResponse> syncAuthenticatedUser() {
        String userId = userService.syncKeycloakUserToDB();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(UserConstants.STATUS_201, UserConstants.getSyncMessage(userId), LocalDateTime.now()));
    }

    /**
     * Retrieves the profile details of the currently authenticated user.
     * * @return a {@link ResponseEntity} containing the {@link UserProfileDTO} with the user's details
     */
    @GetMapping(path = "/me")
    public ResponseEntity<UserProfileDTO> getUserDetails() {
        UserProfileDTO dto = userService.getUser();
        return ResponseEntity.status(HttpStatus.OK)
                .body(dto);
    }
}
