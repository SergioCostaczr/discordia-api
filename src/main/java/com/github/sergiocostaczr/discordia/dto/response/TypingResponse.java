package com.github.sergiocostaczr.discordia.dto.response;

import java.util.UUID;

public record TypingResponse(
        UUID roomId,
        String username,
        boolean typing
) {
}
