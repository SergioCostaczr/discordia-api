package com.github.sergiocostaczr.discordia.controller.rest;

import com.github.sergiocostaczr.discordia.dto.response.MessageDeletedResponse;
import com.github.sergiocostaczr.discordia.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID messageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID roomId = chatService.deleteMessage(messageId, userDetails.getUsername());
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/messages/deleted",
                new MessageDeletedResponse(roomId, messageId)
        );
        return ResponseEntity.noContent().build();
    }
}
