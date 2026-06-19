package com.app.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Objects;

@Component("ticketListKeyGenerator")
@RequiredArgsConstructor
public class TicketListKeyGenerator implements KeyGenerator {
    private final AuthenticationUtil authenticationUtil;

    @Override
    public Object generate(Object target, Method method, Object... params) {
        // 1. Pull the user out of the context dynamically
        String keycloakId = authenticationUtil.getUserFromSecurityContext().getKeycloakId();

        // params map to: [0] pageNumber, [1] pageSize, [2] status, [3] category
        String pageNumber = Objects.toString(params[0]);
        String pageSize = Objects.toString(params[1]);
        String status = params[2] != null ? params[2].toString() : "ALL";
        String category = params[3] != null ? params[3].toString() : "ALL";

        // 2. Output the composite key format
        return String.format("%s:%s:%s:%s:%s", keycloakId, status, category, pageNumber, pageSize);
    }
}
