package com.github.sergiocostaczr.discordia.repository;

import com.github.sergiocostaczr.discordia.model.entity.RoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RoomMemberRepository extends JpaRepository<RoomMember, UUID> {
    boolean existsByRoomIdAndUserId(UUID roomId, UUID userId);
}
