package com.github.sergiocostaczr.discordia.messaging.consumer;


import com.github.sergiocostaczr.discordia.config.RabbitMQConfig;
import com.github.sergiocostaczr.discordia.dto.request.GameMoveEvent;
import com.github.sergiocostaczr.discordia.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameEventConsumer {

    private final GameService gameService;

    @RabbitListener(queues = RabbitMQConfig.GAME_QUEUE)
    public void consume(GameMoveEvent event) {
        gameService.processMove(event);
    }
}