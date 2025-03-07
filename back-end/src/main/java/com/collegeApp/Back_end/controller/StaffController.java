package com.collegeApp.back_end.controller;

import com.collegeApp.Back_end.model.TaskStatus;
import com.collegeApp.Back_end.model.TaskSubmission;
import com.collegeApp.back_end.model.StaffMessage;
import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.service.StaffService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/staff")
public class StaffController {
    @Autowired
    private StaffService staffService;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/getTasks/{staffId}")
    public ResponseEntity<List<Task>> getTasks(@PathVariable String staffId) {
        List<Task> tasks = staffService.getTasksByStaffId(staffId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/downloadFile/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName) {
        Task task = taskRepository.findByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("File not found: " + fileName));

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + task.getFileName() + "\"")
                .body(new ByteArrayResource(task.getFileData()));
    }

    @PostMapping("/sendMessage")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<String> sendMessage(
            @RequestPart("task") String taskJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            StaffMessage task = objectMapper.readValue(taskJson, StaffMessage.class);
            staffService.saveTask(task, file);
            return ResponseEntity.ok("Task added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding task: " + e.getMessage());
        }
    }
    @PostMapping("/submitTask")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<String> submitTask(
            @RequestPart("task") String taskJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        try {
            TaskSubmission task = objectMapper.readValue(taskJson, TaskSubmission.class);
            staffService.submitTask(task, file);

            return ResponseEntity.ok("Task submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error submitting task: " + e.getMessage());
        }
    }
    @PostMapping("/submitTaskStatus")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<String> submitTaskStatus(@RequestBody TaskStatus taskStatus){
        try {

           staffService.addStatus(taskStatus);
            return ResponseEntity.ok("Task submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error submitting task: " + e.getMessage());
        }
    }

}
