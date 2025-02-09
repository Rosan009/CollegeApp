package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            taskMap.put("filePath", (task.getFileName() != null)
                    ? "http://10.0.2.2:8083/files/" + task.getId()
                    : null);
            return taskMap;
        }).toList();

        return ResponseEntity.ok(taskResponses);
    }


    @GetMapping("/files/{taskId}")
    public ResponseEntity<byte[]> getFile(@PathVariable int taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + task.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(task.getFileType()))
                .body(task.getFileData());
    }
}
