package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.model.User;
import com.collegeApp.back_end.repo.UserRepo;
import com.collegeApp.back_end.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        try {
            System.out.println("Login attempt for user: " + user.getUsername());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User dbUser = userRepo.findByUsername(user.getUsername()).orElseThrow();

            // Normalize role to be either "ADMIN" or "STAFF"
            String normalizedRole = dbUser.getRole().replace("ROLE_", ""); // Remove "ROLE_"

            String token = jwtTokenProvider.generateToken(user.getUsername(), normalizedRole);

            Map<String, String> response = Map.of(
                    "message", "Login successful",
                    "username", userDetails.getUsername(),
                    "role", normalizedRole,
                    "token", token
            );

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    @GetMapping("/get")
    public List<User> getValue() {
        return userRepo.findAll();
    }
}
