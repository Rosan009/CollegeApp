package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.service.StaffService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/staff")
public class StaffController {
    @Autowired
    private StaffService staffService;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/getTasks/{staffId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<Map<String, Object>>> getTasks(@PathVariable String staffId) {
        List<Task> tasks = staffService.getTasksByStaffId(staffId);

        List<Map<String, Object>> taskResponses = tasks.stream().map(task -> {
            Map<String, Object> taskMap = new HashMap<>();
            taskMap.put("id", task.getId());
            taskMap.put("title", task.getTitle());
            taskMap.put("description", task.getDescription());

            // Generate file URL instead of returning only file name
            if (task.getFileData() != null) {
                String fileUrl = "http://localhost:8083/staff/download/" + task.getId(); // Make sure to use the correct base URL for your environment
                taskMap.put("filePath", fileUrl);
            } else {
                taskMap.put("filePath", null);
            }

            return taskMap;
        }).toList();

        return ResponseEntity.ok(taskResponses);
    }

    // Endpoint to serve the file by task ID
    @GetMapping("/staff/download/{taskId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable int taskId) {
        Task task = StaffService.getTaskById(taskId);
        if (task.getFileData() != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + task.getFileName())
                    .body(task.getFileData());
        }
        return ResponseEntity.notFound().build();
    }

}
