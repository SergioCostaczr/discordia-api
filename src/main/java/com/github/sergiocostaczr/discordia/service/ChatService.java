package com.github.sergiocostaczr.discordia.service;

import com.github.sergiocostaczr.discordia.dto.*;
import com.github.sergiocostaczr.discordia.dto.request.ChatMessageRequest;
import com.github.sergiocostaczr.discordia.dto.response.ChatMessageResponse;
import com.github.sergiocostaczr.discordia.messaging.producer.MessageProducer;
import com.github.sergiocostaczr.discordia.model.entity.Message;
import com.github.sergiocostaczr.discordia.repository.*;
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
        var pageable = PageRequest.of(page, size);
        return messageRepository.findByRoomIdOrderBySentAtDesc(roomId, pageable)
                .map(ChatMessageResponse::from);
    }
}