package com.app.ticket.validation.validator;

import com.app.ticket.validation.annotation.ValidateTicketPriority;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.List;

public class TicketPriorityValidator implements ConstraintValidator<ValidateTicketPriority, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        List<String> validPriorities = Arrays.asList("LOW", "MEDIUM", "HIGH", "URGENT");
        return validPriorities.contains(value.trim().toUpperCase());
    }
}
