package com.app.auth.service;

import com.app.auth.dto.UserProfileDTO;
import com.app.auth.entity.User;
import com.app.auth.repository.IUserRepository;
import com.app.common.exception.ResourceAlreadyExistsException;
import com.app.common.mapper.UserMapper;
import com.app.common.util.AuthenticationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UserMapper userMapper;
    private final AuthenticationUtil authUtil;
    private final IUserRepository userRepository;

    /**
     * Synchronizes a newly authenticated Keycloak user into the local database.
     * <p>
     * This method extracts the user's profile from the current security context,
     * validates that the email is unique, maps the DTO to a domain entity, and
     * persists it. It is executed within a transactional context to ensure
     * data integrity.
     * </p>
     *
     * @return the unique string ID of the newly saved user
     * @throws ResourceAlreadyExistsException if a user with the same email already exists in the database
     */
    @Override
    @Transactional
    public UserProfileDTO syncKeycloakUserToDB() {
        // Get the user from authentication object
        UserProfileDTO dto = authUtil.getUserFromSecurityContext();

        // Check if user already exists based on the unique email
        Optional<User> existingUser = userRepository.findByEmail(dto.getEmail());

        // validate whether user with given email is already exists
        if (existingUser.isPresent()) return dto;

        // map the dto to user
        User newUser = new User();
        userMapper.mapUserProfileDtoToUser(dto, newUser);

        // save user to the db
        userRepository.save(newUser);

        // return synced user id
        return dto;
    }

    /**
     * Retrieves the profile details of the currently authenticated user from the security context.
     *
     * @return the {@link UserProfileDTO} containing the logged-in user's data
     */
    @Override
    public UserProfileDTO getUser() {
        // Get the user from authentication object and return it
        return authUtil.getUserFromSecurityContext();
    }
}
