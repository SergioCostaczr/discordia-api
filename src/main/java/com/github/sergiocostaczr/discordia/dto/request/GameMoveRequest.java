package com.github.sergiocostaczr.discordia.dto.request;

import com.github.sergiocostaczr.discordia.model.enums.Move;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GameMoveRequest(
        @NotNull UUID roundId,
        @NotNull Move move
){}
