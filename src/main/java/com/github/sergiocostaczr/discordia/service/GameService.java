package com.github.sergiocostaczr.discordia.service;

import com.github.sergiocostaczr.discordia.dto.request.*;
import com.github.sergiocostaczr.discordia.dto.response.*;
import com.github.sergiocostaczr.discordia.model.entity.*;
import com.github.sergiocostaczr.discordia.model.enums.*;
import com.github.sergiocostaczr.discordia.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRoundRepository gameRoundRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChallengeResponse createChallenge(ChallengeRequest request, String challengerUsername) {
        var challenger = userRepository.findByUsername(challengerUsername).orElseThrow();
        var challenged = userRepository.findById(request.challengedUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário desafiado não encontrado."));
        var room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new IllegalArgumentException("Sala não encontrada."));

        if (challenger.getId().equals(challenged.getId())) {
            throw new IllegalArgumentException("Você não pode se auto-desafiar.");
        }

        if (!roomMemberRepository.existsByRoomIdAndUserId(room.getId(), challenger.getId()) ||
                !roomMemberRepository.existsByRoomIdAndUserId(room.getId(), challenged.getId())) {
            throw new IllegalArgumentException("Ambos os usuários precisam estar na sala.");
        }

        boolean activeRoundExists = gameRoundRepository
                .existsByRoomIdAndChallengerIdAndChallengedIdAndStatusIn(
                        room.getId(),
                        challenger.getId(),
                        challenged.getId(),
                        List.of(RoundStatus.WAITING, RoundStatus.IN_PROGRESS)
                );

        if (activeRoundExists) {
            throw new IllegalStateException("Já existe uma partida ativa entre esses jogadores.");
        }

        var round = GameRound.builder()
                .room(room)
                .challenger(challenger)
                .challenged(challenged)
                .build();

        var saved = gameRoundRepository.save(round);

        // notifica o desafiado via WebSocket
        messagingTemplate.convertAndSendToUser(
                challenged.getUsername(),
                "/queue/challenges",
                new ChallengeNotification(saved.getId(), challenger.getUsername(), room.getName())
        );

        return ChallengeResponse.from(saved);
    }

    @Transactional
    public void processMove(GameMoveEvent event) {
        var round = gameRoundRepository.findById(event.roundId())
                .orElseThrow(() -> new IllegalArgumentException("Partida não encontrada."));
        var player = userRepository.findById(event.playerId())
                .orElseThrow();

        if (round.getStatus() == RoundStatus.FINISHED ||
                round.getStatus() == RoundStatus.CANCELLED) {
            return;
        }

        if (round.getChallenger().getId().equals(player.getId())) {
            round.setChallengerMove(event.move());
        } else if (round.getChallenged().getId().equals(player.getId())) {
            round.setChallengedMove(event.move());
        } else {
            throw new IllegalArgumentException("Usuário não pertence a esta partida.");
        }

        round.setStatus(RoundStatus.IN_PROGRESS);
        var saved = gameRoundRepository.save(round);

        if (saved.getChallengerMove() != null && saved.getChallengedMove() != null) {
            resolve(saved);
        }
    }

    private void resolve(GameRound round) {
        User winner = determineWinner(round);
        round.setWinner(winner);
        round.setStatus(RoundStatus.FINISHED);
        round.setPlayedAt(LocalDateTime.now());
        gameRoundRepository.save(round);

        var result = GameResultResponse.from(round);

        messagingTemplate.convertAndSendToUser(
                round.getChallenger().getUsername(), "/queue/game-results", result
        );
        messagingTemplate.convertAndSendToUser(
                round.getChallenged().getUsername(), "/queue/game-results", result
        );
    }

    private User determineWinner(GameRound round) {
        Move m1 = round.getChallengerMove();
        Move m2 = round.getChallengedMove();

        if (m1 == m2) return null; // empate

        boolean challengerWins =
                (m1 == Move.ROCK     && m2 == Move.SCISSORS) ||
                        (m1 == Move.SCISSORS && m2 == Move.PAPER)    ||
                        (m1 == Move.PAPER    && m2 == Move.ROCK);

        return challengerWins ? round.getChallenger() : round.getChallenged();
    }
}