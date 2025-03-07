package com.collegeApp.back_end.controller;

import com.collegeApp.Back_end.model.TaskSubmission;
import com.collegeApp.back_end.model.StaffMessage;
import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.StaffMessageRepo;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.repo.UserRepo;
import com.collegeApp.back_end.service.AdminService;
import com.fasterxml.jackson.databind.JsonNode;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
        return ResponseEntity.ok(staffList);
    }



    @PostMapping("/addTask")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addTask(@RequestPart String task, @RequestPart MultipartFile file) {
        try {
            // Parse the task JSON
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode taskNode = objectMapper.readTree(task);

            // Extract fields
            String title = taskNode.get("title").asText();
            String description = taskNode.get("description").asText();
            String staffId = taskNode.get("staffId").asText();
            String deadlineString = taskNode.get("deadline").asText();

            int daysToAdd = Integer.parseInt(deadlineString); // Parse the deadline as a number
            LocalDateTime futureDate = LocalDateTime.now().plusDays(daysToAdd); // Add days to current date

            Task newTask = new Task();
            newTask.setTitle(title);
            newTask.setDescription(description);
            newTask.setStaffId(staffId);
            newTask.setDeadline(futureDate); // Set the calculated future date

             adminService.saveTask(newTask, file);

            return ResponseEntity.ok("Task added successfully!");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid deadline format. Expected a number.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding task: " + e.getMessage());
        }
    }

    @GetMapping("/getTasks/{staffId}")
    public ResponseEntity<List<Task>> getTasks(@PathVariable String staffId) {
        return ResponseEntity.ok(adminService.getTasksByStaffId(staffId));
    }

    @GetMapping("/getSubmittedTasks/{staffId}")
    public ResponseEntity<List<TaskSubmission>> getSubmittedTasks(@PathVariable String staffId) {
        List<TaskSubmission> submittedTasks = adminService.getSubmittedTasksByStaffId(staffId);
        return ResponseEntity.ok(submittedTasks);
    }
}