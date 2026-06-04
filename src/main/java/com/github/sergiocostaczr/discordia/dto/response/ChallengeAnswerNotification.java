package com.github.sergiocostaczr.discordia.dto.response;

import java.util.UUID;

public record ChallengeAnswerNotification(
        UUID roundId,
        UUID roomId,
        String challengerUsername,
        String respondentUsername,
        boolean accepted
) {}
