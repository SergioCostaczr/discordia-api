package com.github.sergiocostaczr.discordia.messaging.producer;

import com.github.sergiocostaczr.discordia.config.RabbitMQConfig;

import com.github.sergiocostaczr.discordia.dto.response.ChatMessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MessageProducer {

    private final RabbitTemplate rabbitTemplate;

    public void publishChatMessage(UUID roomId, ChatMessageResponse message) {
        String routingKey = "room." + roomId;
        rabbitTemplate.convertAndSend(RabbitMQConfig.CHAT_EXCHANGE, routingKey, message);

    }
}