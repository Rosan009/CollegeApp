package com.collegeApp.back_end.controller;

import com.collegeApp.Back_end.model.TaskSubmission;
import com.collegeApp.back_end.model.StaffMessage;
import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.StaffMessageRepo;
import com.collegeApp.back_end.repo.UserRepo;
import com.collegeApp.back_end.service.AdminService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.collegeApp.back_end.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;



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
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode taskNode = objectMapper.readTree(task);

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
            newTask.setDeadline(futureDate);

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

    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> getReport() {
        try {
            // Use the full path to the reports folder
            File reportDir = new File("D:/Documents/CollegeApp/back-end/src/main/resources/reports");

            if (!reportDir.exists() || !reportDir.isDirectory()) {
                System.out.println("Report directory not found: " + reportDir.getAbsolutePath());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Report directory not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            File[] files = reportDir.listFiles((dir, name) -> name.startsWith("tasks_report_") && name.endsWith(".pdf"));

            if (files == null || files.length == 0) {
                System.out.println("No reports found in directory: " + reportDir.getAbsolutePath());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "No reports found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            Arrays.sort(files, Comparator.comparingLong(File::lastModified).reversed());
            File latestReport = files[0];

            System.out.println("Latest report found: " + latestReport.getAbsolutePath());

            byte[] pdfBytes = Files.readAllBytes(latestReport.toPath());
            String base64File = Base64.getEncoder().encodeToString(pdfBytes);

            Map<String, Object> response = new HashMap<>();
            response.put("fileData", base64File);
            response.put("fileName", latestReport.getName());
            response.put("fileType", "application/pdf");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}