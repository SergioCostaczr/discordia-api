package com.github.sergiocostaczr.discordia.controller.ws;

import com.github.sergiocostaczr.discordia.dto.request.ChatMessageRequest;
import com.github.sergiocostaczr.discordia.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatWsController {

    private final ChatService chatService;

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable UUID roomId,
                            @Payload ChatMessageRequest request,
                            Principal principal) {

        chatService.sendMessage(roomId, principal.getName(), request);

    }
}