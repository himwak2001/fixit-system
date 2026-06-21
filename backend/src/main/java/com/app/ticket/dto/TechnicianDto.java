package com.app.ticket.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class TechnicianDto implements Serializable {
    private String id;
    private String name;
    private String specialization;
}
