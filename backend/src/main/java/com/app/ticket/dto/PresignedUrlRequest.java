package com.app.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignedUrlRequest {
    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "Content type is required")
    @Pattern(
            regexp = "image/jpeg|image/png",
            message = "Only image/jpeg and image/png are allowed"
    )
    private String contentType;
}
