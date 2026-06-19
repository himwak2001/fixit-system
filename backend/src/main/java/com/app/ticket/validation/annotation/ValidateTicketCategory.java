package com.app.ticket.validation.annotation;

import com.app.ticket.validation.validator.TicketCategoryValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TicketCategoryValidator.class)
public @interface ValidateTicketCategory {
    String message() default "Invalid Ticket category";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
