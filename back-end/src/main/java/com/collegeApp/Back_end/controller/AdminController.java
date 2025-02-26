package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.model.StaffMessage;
import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.StaffMessageRepo;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.repo.UserRepo;
import com.collegeApp.back_end.service.AdminService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.collegeApp.back_end.model.User;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private AdminService adminService;

    @Autowired
    private StaffMessageRepo staffMessageRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/createStaff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> registerStaff(
            @RequestBody User user) throws IOException {
        adminService.addStaff(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Successfully registered");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get")
    public ResponseEntity<List<User>> getAllStaff() {
        List<User> staffList = userRepository.findAll();
        return ResponseEntity.ok(staffList);
    }
    @GetMapping("/getMessage/{staffId}")
    public ResponseEntity<List<StaffMessage>> getMessage(@PathVariable String staffId) {
        List<StaffMessage> staffList = staffMessageRepo.findByStaffId(staffId);
        System.out.println("staffId"+staffId);
        System.out.println(staffList);
        return ResponseEntity.ok(staffList);
    }

    @PostMapping("/addTask")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addTask(
            @RequestPart("task") String taskJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Task task = objectMapper.readValue(taskJson, Task.class);
            adminService.saveTask(task, file);
            return ResponseEntity.ok("Task added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding task: " + e.getMessage());
        }
    }

}