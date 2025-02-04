package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.UserRepo;
import com.collegeApp.back_end.service.AdminService;
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

    @PostMapping("/addTask")
    public ResponseEntity<Task> addTask(
            @RequestParam String staffId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile file) {

        Task task = new Task();
        task.setStaffId(staffId);
        task.setTitle(title);
        task.setDescription(description);

        if (file != null && !file.isEmpty()) {
            try {
                String filePath = UPLOAD_DIR + file.getOriginalFilename();
                file.transferTo(new File(filePath));
                task.setFilePath(filePath);
            } catch (IOException e) {
                return ResponseEntity.status(500).body(null);
            }
        }

        Task savedTask =adminService.addTask(task);
        return ResponseEntity.ok(savedTask);
    }

    @GetMapping("/tasks/{staffId}")
    public ResponseEntity<List<Task>> getTasks(@PathVariable Long staffId) {
        List<Task> tasks = taskService.getTasksByStaffId(staffId);
        return ResponseEntity.ok(tasks);
    }
}
