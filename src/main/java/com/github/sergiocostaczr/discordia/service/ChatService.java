package com.github.sergiocostaczr.discordia.service;

import com.github.sergiocostaczr.discordia.dto.request.ChatMessageRequest;
import com.github.sergiocostaczr.discordia.dto.response.ChatMessageResponse;
import com.github.sergiocostaczr.discordia.messaging.producer.MessageProducer;
import com.github.sergiocostaczr.discordia.model.entity.Message;
import com.github.sergiocostaczr.discordia.model.enums.Role;
import com.github.sergiocostaczr.discordia.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final MessageProducer messageProducer;

    public void sendMessage(UUID roomId, String username, ChatMessageRequest request) {
        var room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Sala não encontrada."));

        var sender = userRepository.findByUsername(username).orElseThrow();

        var message = Message.builder()
                .room(room)
                .sender(sender)
                .content(request.content())
                .build();

        var saved = messageRepository.save(message);
        messageProducer.publishChatMessage(roomId, ChatMessageResponse.from(saved));
    }

    public Page<ChatMessageResponse> getHistory(UUID roomId, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("sentAt").descending());
        return messageRepository.findByRoomIdOrderBySentAtDesc(roomId, pageable)
                .map(ChatMessageResponse::from);
    }

    @Transactional
    public UUID deleteMessage(UUID messageId, String username) {
        var user = userRepository.findByUsername(username).orElseThrow();
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Mensagem não encontrada."));
        UUID roomId = message.getRoom().getId();

        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isAuthor = message.getSender().getId().equals(user.getId());

        if (!isAdmin && !isAuthor) {
            throw new SecurityException("Você não tem permissão para excluir essa mensagem.");
        }

        messageRepository.delete(message);
        return roomId;
    }
}
