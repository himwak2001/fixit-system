package com.app.ticket.validation.annotation;

import com.app.ticket.validation.validator.TicketStatusValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TicketStatusValidator.class)
public @interface ValidateTicketStatus {
    String message() default "Invalid Ticket Status";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
