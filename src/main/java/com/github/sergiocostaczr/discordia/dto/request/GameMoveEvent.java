package com.github.sergiocostaczr.discordia.dto.request;

import com.github.sergiocostaczr.discordia.model.enums.Move;
import java.util.UUID;

public record GameMoveEvent(
        UUID roundId,
        UUID playerId,
        Move move
) {}