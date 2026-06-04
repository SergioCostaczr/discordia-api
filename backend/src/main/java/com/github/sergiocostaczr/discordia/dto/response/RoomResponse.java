package com.github.sergiocostaczr.discordia.dto.response;

import com.github.sergiocostaczr.discordia.model.entity.Room;

import java.time.LocalDateTime;
import java.util.UUID;

public record RoomResponse(
        UUID id,
        String name,
        String description,
        String createdBy,
        LocalDateTime createdAt
) {

    public static RoomResponse from(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getDescription(),
                room.getCreatedBy().getUsername(),
                room.getCreatedAt()
        );
    }
}
