package com.github.sergiocostaczr.discordia.dto.response;

import com.github.sergiocostaczr.discordia.model.entity.RoomMember;
import com.github.sergiocostaczr.discordia.model.enums.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public record RoomMemberResponse(
        UUID id,
        String username,
        Role role,
        LocalDateTime joinedAt
) {
    public static RoomMemberResponse from(RoomMember member) {
        return new RoomMemberResponse(
                member.getUser().getId(),
                member.getUser().getUsername(),
                member.getUser().getRole(),
                member.getJoinedAt()
        );
    }
}
