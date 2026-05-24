package com.github.sergiocostaczr.discordia.service;

import com.github.sergiocostaczr.discordia.dto.response.AuthResponse;
import com.github.sergiocostaczr.discordia.dto.request.LoginRequest;
import com.github.sergiocostaczr.discordia.dto.request.RegisterRequest;
import com.github.sergiocostaczr.discordia.model.entity.User;
import com.github.sergiocostaczr.discordia.model.enums.Role;
import com.github.sergiocostaczr.discordia.model.repo.UserRepository;
import com.github.sergiocostaczr.discordia.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.username())){
            throw new IllegalStateException("Username já está em uso");
        }
        User user = User.builder()
                .username(registerRequest.username())
                .password(passwordEncoder.encode(registerRequest.password()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        var user = userRepository.findByUsername(request.username()).orElseThrow();
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token);
    }

}
