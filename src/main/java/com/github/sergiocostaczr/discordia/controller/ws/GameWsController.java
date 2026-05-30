package com.github.sergiocostaczr.discordia.controller.ws;


import com.github.sergiocostaczr.discordia.dto.request.GameMoveRequest;
import com.github.sergiocostaczr.discordia.messaging.producer.GameEventProducer;
import com.github.sergiocostaczr.discordia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.MessageMapping;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class GameWsController {

    private final GameEventProducer gameEventProducer;
    private final UserRepository userRepository;

    @MessageMapping("/game/move")
    public void receiveMove(@Payload GameMoveRequest request, Principal principal) {
        var player = userRepository.findByUsername(principal.getName()).orElseThrow();
        gameEventProducer.publishMove(request.roundId(), player.getId(), request.move());
    }
}