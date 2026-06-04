package com.github.sergiocostaczr.discordia.dto.response;

import java.util.UUID;

public record MessageDeletedResponse(
        UUID roomId,
        UUID messageId
) {
}
