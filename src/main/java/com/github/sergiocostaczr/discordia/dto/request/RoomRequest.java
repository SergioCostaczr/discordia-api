package com.github.sergiocostaczr.discordia.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RoomRequest(
        @NotBlank String name,
        String description
) {
}
