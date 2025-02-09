package com.collegeApp.back_end.service;

import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.model.User;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AdminService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TaskRepository taskRepository;

    public void addStaff(User user) throws IOException {
        user.setPassword(new BCryptPasswordEncoder(12).encode(user.getPassword()));
        user.setRole("STAFF");
        userRepo.save(user);
    }

    public void saveTask(Task task, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            // Convert file to bytes and store in Task entity
            task.setFileName(file.getOriginalFilename());
            task.setFileType(file.getContentType());
            task.setFileData(file.getBytes());
        }

        // Save to DB
        taskRepository.save(task);
    }
}
