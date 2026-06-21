package com.app.ticket.validation.validator;

import com.app.ticket.validation.annotation.ValidateTicketStatus;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.List;

public class TicketStatusValidator implements ConstraintValidator<ValidateTicketStatus, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        List<String> validStatus = Arrays.asList("OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED");
        return validStatus.contains(value.trim().toUpperCase());
    }
}
