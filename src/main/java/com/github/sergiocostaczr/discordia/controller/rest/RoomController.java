package com.github.sergiocostaczr.discordia.controller.rest;

import com.github.sergiocostaczr.discordia.dto.request.RegisterRequest;
import com.github.sergiocostaczr.discordia.dto.request.RoomRequest;
import com.github.sergiocostaczr.discordia.dto.response.ChatMessageResponse;
import com.github.sergiocostaczr.discordia.dto.response.RoomResponse;
import com.github.sergiocostaczr.discordia.service.ChatService;
import com.github.sergiocostaczr.discordia.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final ChatService chatService;


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> create(
            @Valid @RequestBody RoomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(201)
                .body(roomService.create(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> listAll() {
        return ResponseEntity.ok(roomService.findAll());
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<Void> join(
            @PathVariable UUID roomId,
            @AuthenticationPrincipal UserDetails userDetails) {
        roomService.join(roomId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getHistory(
            @PathVariable UUID roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(chatService.getHistory(roomId, page, size));
    }
}
