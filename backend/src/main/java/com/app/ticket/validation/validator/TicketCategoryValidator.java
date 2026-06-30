package com.app.ticket.validation.validator;

import com.app.ticket.validation.annotation.ValidateTicketCategory;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.List;

public class TicketCategoryValidator implements ConstraintValidator<ValidateTicketCategory, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true;
        }
        List<String> validCategories = Arrays.asList("PLUMBING", "ELECTRICAL", "HVAC", "CLEANING", "OTHER");
        return validCategories.contains(value.trim().toUpperCase());
    }
}
