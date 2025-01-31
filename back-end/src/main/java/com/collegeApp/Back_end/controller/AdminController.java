package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.collegeApp.back_end.model.User;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepo userRepository;

    @PostMapping("/createUser")
    public String createUser(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setRole("STAFF");
        userRepository.save(user);
        return "Staff user created successfully!";
    }
}
