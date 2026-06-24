package com.app.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(auth -> auth
                        // Authentication Sync & Profiles (Available to any logged-in user)
                        .requestMatchers("/api/v1/auth/sync").authenticated()
                        .requestMatchers("/api/v1/auth/me").authenticated()

                        // combine operations
                        .requestMatchers(HttpMethod.POST, "/api/v1/tickets/*/upload-url").hasAnyRole("TENANT", "ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/tickets/*/attachments").hasAnyRole("TENANT", "ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/tickets/*/attachments/*/view").hasAnyRole("TENANT", "ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/tickets/*/comments").hasAnyRole("TENANT", "ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/tickets/*/comments").hasAnyRole("TENANT", "ADMIN", "TECHNICIAN")

                        // tenant specific operations
                        .requestMatchers(HttpMethod.POST, "/api/v1/tickets/").hasRole("TENANT")
                        .requestMatchers(HttpMethod.GET, "/api/v1/tickets/me").hasRole("TENANT")
                        .requestMatchers(HttpMethod.GET, "/api/v1/tickets/*").hasRole("TENANT")
                        .requestMatchers(HttpMethod.GET, "/api/v1/tickets/*/close").hasRole("TENANT")

                        // technician specific operations
                        .requestMatchers("/api/v1/technician/tickets/**").hasRole("TECHNICIAN")

                        // admin specific operations
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/dashboard/stats").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter convert = new JwtAuthenticationConverter();
        convert.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
        return convert;
    }
}
