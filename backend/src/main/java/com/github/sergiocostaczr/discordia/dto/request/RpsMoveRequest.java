package com.github.sergiocostaczr.discordia.dto.request;

import com.github.sergiocostaczr.discordia.model.enums.Move;
import jakarta.validation.constraints.NotNull;

public record RpsMoveRequest(
        @NotNull Move move
) {
}
