package com.app.auth.service;

import com.app.auth.dto.UserProfileDTO;

public interface IUserService {
    // method to sync keycloak user to the DB
    String syncKeycloakUserToDB();

    // method to get user
    UserProfileDTO getUser();
}
