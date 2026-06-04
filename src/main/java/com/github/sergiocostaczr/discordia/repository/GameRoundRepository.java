package com.github.sergiocostaczr.discordia.repository;

import com.github.sergiocostaczr.discordia.model.entity.GameRound;
import com.github.sergiocostaczr.discordia.model.enums.RoundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface GameRoundRepository extends JpaRepository<GameRound, UUID> {
    boolean existsByRoomIdAndChallengerIdAndChallengedIdAndStatusIn(
            UUID roomId, UUID challengerId, UUID challengedId, List<RoundStatus> statuses
    );

    @Query("""
            select count(round) > 0
            from GameRound round
            where round.room.id = :roomId
              and round.status in :statuses
              and (
                (round.challenger.id = :userAId and round.challenged.id = :userBId)
                or
                (round.challenger.id = :userBId and round.challenged.id = :userAId)
              )
            """)
    boolean existsActiveBetweenUsers(
            @Param("roomId") UUID roomId,
            @Param("userAId") UUID userAId,
            @Param("userBId") UUID userBId,
            @Param("statuses") List<RoundStatus> statuses
    );
}
