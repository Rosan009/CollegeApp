package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.model.User;
import com.collegeApp.back_end.repo.UserRepo;
import com.collegeApp.back_end.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

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
    public Map<String, String> login(@RequestBody User user) {
        System.out.println("Login attempt for user: " + user.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        // Generate JWT token after successful authentication
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(user.getUsername(),user.getRole());

        return Map.of(
                "message", "Login successful",
                "username", userDetails.getUsername(),
                "token", token
        );
    }

    @GetMapping("/get")
    public List<User> getValue() {
        return userRepo.findAll();
    }
}
