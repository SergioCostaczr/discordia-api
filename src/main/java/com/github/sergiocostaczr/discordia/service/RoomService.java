package com.github.sergiocostaczr.discordia.service;

import com.github.sergiocostaczr.discordia.dto.request.RoomRequest;
import com.github.sergiocostaczr.discordia.dto.response.RoomResponse;
import com.github.sergiocostaczr.discordia.model.entity.Room;
import com.github.sergiocostaczr.discordia.model.entity.RoomMember;
import com.github.sergiocostaczr.discordia.model.entity.User;
import com.github.sergiocostaczr.discordia.repository.RoomMemberRepository;
import com.github.sergiocostaczr.discordia.repository.RoomRepository;
import com.github.sergiocostaczr.discordia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final UserRepository userRepository;

    public RoomResponse create(RoomRequest request, String username) {
        roomRepository.findByName(request.name()).ifPresent(room -> {
            throw new IllegalStateException("Room with name " + request.name() + " already exists");
        });
        var admin = userRepository.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("Usuário não encontrado"));

        var room = Room.builder()
                .name(request.name())
                .description(request.description())
                .createdBy(admin)
                .build();

        return RoomResponse.from(roomRepository.save(room));
    }

    public List<RoomResponse> findAll() {
        return roomRepository.findAll()
                .stream()
                .map(room -> RoomResponse.from(room))
                .toList();
    }

    public void join(UUID roomId, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Sala não encontrada."));

        User user = userRepository.findByUsername(username).orElseThrow();

        if (roomMemberRepository.existsByRoomIdAndUserId(roomId, user.getId())) {
            throw new IllegalArgumentException("Usuário já está na sala");
        }

        RoomMember member = RoomMember.builder()
                .room(room)
                .user(user)
                .build();

        roomMemberRepository.save(member);
    }

    public void assertBothInRoom(UUID roomId, UUID userAId, UUID userBId) {
        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, userAId) ||
                !roomMemberRepository.existsByRoomIdAndUserId(roomId, userBId)) {
            throw new IllegalArgumentException("Ambos os usuários precisam estar na sala.");
        }
    }
}

