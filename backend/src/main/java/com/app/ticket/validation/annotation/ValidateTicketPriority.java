package com.app.ticket.validation.annotation;

import com.app.ticket.validation.validator.TicketPriorityValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TicketPriorityValidator.class)
public @interface ValidateTicketPriority {
    String message() default "Invalid Ticket Priority";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
