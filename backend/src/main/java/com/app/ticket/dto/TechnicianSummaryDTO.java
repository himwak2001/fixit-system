package com.app.ticket.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class TechnicianSummaryDTO implements Serializable {
    private String id;
    private String fullName;
    private String email;
    private String specialization;
}
