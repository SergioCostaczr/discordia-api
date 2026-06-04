package com.github.sergiocostaczr.discordia.messaging.producer;

import com.github.sergiocostaczr.discordia.config.RabbitMQConfig;
import com.github.sergiocostaczr.discordia.dto.request.GameMoveEvent;
import com.github.sergiocostaczr.discordia.model.enums.Move;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GameEventProducer {

    private final RabbitTemplate rabbitTemplate;

    public void publishMove(UUID roundId, UUID playerId, Move move) {
        var event = new GameMoveEvent(roundId, playerId, move);
        rabbitTemplate.convertAndSend(RabbitMQConfig.GAME_EXCHANGE, RabbitMQConfig.GAME_RK, event);
    }
}