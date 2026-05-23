package com.github.sergiocostaczr.discordia.model.repo;

import com.github.sergiocostaczr.discordia.model.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {
}
