package com.github.sergiocostaczr.discordia.repository;


import com.github.sergiocostaczr.discordia.model.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    Page<Message> findByRoomIdOrderBySentAtDesc(UUID roomId, Pageable pageable);
}