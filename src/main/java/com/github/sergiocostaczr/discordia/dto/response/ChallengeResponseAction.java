package com.github.sergiocostaczr.discordia.dto.response;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ChallengeResponseAction(
        @NotNull UUID roundId,
        @NotNull Boolean accepted
) {}