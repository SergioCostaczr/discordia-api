package com.github.sergiocostaczr.discordia.messaging.consumer;

import com.github.sergiocostaczr.discordia.config.RabbitMQConfig;
import com.github.sergiocostaczr.discordia.dto.response.ChatMessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatMessageConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = RabbitMQConfig.CHAT_QUEUE)
    public void consume(ChatMessageResponse message) {
        String destination = "/topic/room/" + message.roomId();
        messagingTemplate.convertAndSend(destination, message);
    }
}