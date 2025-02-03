package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.collegeApp.back_end.model.User;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepo userRepository;

    @PostMapping("/createUser")
    @PreAuthorize("hasRole('ADMIN')")
    public String createUser(@RequestBody User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authenticated user: " + authentication.getName());
        System.out.println("User roles: " + authentication.getAuthorities());

        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setRole("STAFF");
        userRepository.save(user);
        return "Staff user created successfully!";
    }


    @GetMapping("/secure-data")
    @PreAuthorize("hasRole('ADMIN')")
    public String secureData() {
        return "This is secured data accessible only by Admins!";
    }
}
