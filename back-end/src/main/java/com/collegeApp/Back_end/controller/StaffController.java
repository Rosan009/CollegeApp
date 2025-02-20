package com.collegeApp.back_end.controller;

import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.service.StaffService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
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
    public ResponseEntity<List<Task>> getTasks(@PathVariable String staffId) {
        return ResponseEntity.ok(staffService.getTasksByStaffId(staffId));
    }

    @GetMapping("/downloadFile/{fileName}")
    public ResponseEntity<?> downloadFile(@PathVariable String fileName) {
        Optional<Task> taskOptional = taskRepository.findByFileName(fileName);

        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + task.getFileName() + "\"")
                    .body(new ByteArrayResource(task.getFileData()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }
    }
}
