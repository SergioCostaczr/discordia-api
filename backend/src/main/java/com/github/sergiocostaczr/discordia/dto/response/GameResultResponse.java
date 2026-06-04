package com.github.sergiocostaczr.discordia.dto.response;

import com.github.sergiocostaczr.discordia.model.entity.GameRound;
import com.github.sergiocostaczr.discordia.model.enums.Move;
import java.util.UUID;

public record GameResultResponse(
        UUID roundId,
        UUID roomId,
        String challengerUsername,
        String challengedUsername,
        Move challengerMove,
        Move challengedMove,
        String winnerUsername,
        String status
) {
    public static GameResultResponse from(GameRound round) {
        return new GameResultResponse(
                round.getId(),
                round.getRoom().getId(),
                round.getChallenger().getUsername(),
                round.getChallenged().getUsername(),
                round.getChallengerMove(),
                round.getChallengedMove(),
                round.getWinner() != null ? round.getWinner().getUsername() : null,
                round.getStatus().name()
        );
    }
}