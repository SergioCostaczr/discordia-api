package com.github.sergiocostaczr.discordia.dto.response;

import java.util.UUID;

public record ChallengeAnswerNotification(
        UUID roundId,
        String respondentUsername,
        boolean accepted
) {}