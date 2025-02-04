package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.repo.UserRepo;
import com.collegeApp.back_end.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
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
    private TaskRepository taskRepository;

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
    @PreAuthorize("hasRole('ADMIN')")
    public String addTask(
            @RequestBody Task task,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {

            if (file != null) {
                String filePath = saveFile(file);
                task.setFilePath(filePath);
            }

            taskRepository.save(task);
            return "Task added successfully!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        String filePath = "path/to/directory/" + fileName;

         File dest = new File(filePath);
        file.transferTo(dest);
        return filePath;
    }
}
