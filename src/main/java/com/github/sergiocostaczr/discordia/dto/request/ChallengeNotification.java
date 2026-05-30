package com.github.sergiocostaczr.discordia.dto.request;

import java.util.UUID;

public record ChallengeNotification(
        UUID roundId,
        String challengerUsername,
        String roomName
) {}