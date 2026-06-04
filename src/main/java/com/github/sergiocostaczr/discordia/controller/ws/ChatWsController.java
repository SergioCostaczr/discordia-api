package com.github.sergiocostaczr.discordia.controller.ws;

import com.github.sergiocostaczr.discordia.dto.request.ChatMessageRequest;
import com.github.sergiocostaczr.discordia.dto.request.TypingRequest;
import com.github.sergiocostaczr.discordia.dto.response.TypingResponse;
import com.github.sergiocostaczr.discordia.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatWsController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable UUID roomId,
                            @Payload ChatMessageRequest request,
                            Principal principal) {

        chatService.sendMessage(roomId, principal.getName(), request);

    }

    @MessageMapping("/typing/{roomId}")
    public void typing(@DestinationVariable UUID roomId,
                       @Payload TypingRequest request,
                       Principal principal) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/typing",
                new TypingResponse(roomId, principal.getName(), request.typing())
        );
    }
}
