package com.github.sergiocostaczr.discordia.dto.response;

import com.github.sergiocostaczr.discordia.model.entity.Message;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChatMessageResponse(
        UUID id,
        UUID roomId,
        String senderUsername,
        String content,
        LocalDateTime sentAt
) {
    public static ChatMessageResponse from(Message message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getRoom().getId(),
                message.getSender().getUsername(),
                message.getContent(),
                message.getSentAt()
        );
    }

}
