package com.github.sergiocostaczr.discordia.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ChallengeRequest(
        @NotNull UUID roomId,
        @NotNull UUID challengedUserId
) {}