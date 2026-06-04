package com.github.sergiocostaczr.discordia.controller.rest;

import com.github.sergiocostaczr.discordia.dto.request.ChallengeRequest;
import com.github.sergiocostaczr.discordia.dto.request.RpsMoveRequest;
import com.github.sergiocostaczr.discordia.dto.response.ChallengeResponse;
import com.github.sergiocostaczr.discordia.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("/challenge")
    public ResponseEntity<ChallengeResponse> challenge(
            @Valid @RequestBody ChallengeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.status(201)
                .body(gameService.createChallenge(request, userDetails.getUsername()));
    }

    @PostMapping("/{roundId}/accept")
    public ResponseEntity<ChallengeResponse> accept(
            @PathVariable UUID roundId,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(gameService.acceptChallenge(roundId, userDetails.getUsername()));
    }

    @PostMapping("/{roundId}/decline")
    public ResponseEntity<Void> decline(
            @PathVariable UUID roundId,
            @AuthenticationPrincipal UserDetails userDetails) {

        gameService.declineChallenge(roundId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{roundId}/move")
    public ResponseEntity<Void> move(
            @PathVariable UUID roundId,
            @Valid @RequestBody RpsMoveRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        gameService.submitMove(roundId, userDetails.getUsername(), request.move());
        return ResponseEntity.ok().build();
    }
}
