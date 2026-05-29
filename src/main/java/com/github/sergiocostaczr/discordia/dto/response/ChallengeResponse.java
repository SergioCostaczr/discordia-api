package com.github.sergiocostaczr.discordia.dto.response;

import com.github.sergiocostaczr.discordia.model.entity.GameRound;
import java.util.UUID;

public record ChallengeResponse(
        UUID roundId,
        String challengerUsername,
        String challengedUsername,
        String status
) {
    public static ChallengeResponse from(GameRound round) {
        return new ChallengeResponse(
                round.getId(),
                round.getChallenger().getUsername(),
                round.getChallenged().getUsername(),
                round.getStatus().name()
        );
    }
}