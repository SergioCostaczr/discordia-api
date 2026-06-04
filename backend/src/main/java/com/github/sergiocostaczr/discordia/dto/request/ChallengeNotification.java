package com.github.sergiocostaczr.discordia.dto.request;

import java.util.UUID;

public record ChallengeNotification(
        UUID roundId,
        UUID roomId,
        String challengerUsername,
        String challengedUsername,
        String roomName
) {}
