package com.github.sergiocostaczr.discordia.model.repo;

import com.github.sergiocostaczr.discordia.model.entity.GameRound;
import com.github.sergiocostaczr.discordia.model.enums.RoundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface GameRoundRepository extends JpaRepository<GameRound, UUID> {
    boolean existsByRoomIdAndChallengerIdAndChallengedIdAndStatusIn(
            UUID roomId, UUID challengerId, UUID challengedId, java.util.List<RoundStatus> statuses
    );
}