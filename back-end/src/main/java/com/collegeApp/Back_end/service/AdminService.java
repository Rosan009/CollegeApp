package com.collegeApp.back_end.service;

import com.collegeApp.Back_end.model.TaskSubmission;
import com.collegeApp.Back_end.repo.TaskSubmissionRepository;
import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.model.User;
import com.collegeApp.back_end.repo.TaskRepository;
import com.collegeApp.back_end.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskSubmissionRepository taskSubmissionRepository;

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

        taskRepository.save(task);
    }
    @Scheduled(fixedRate = 3600000) // Runs every 1 hour (3600000 ms)
    public void deleteExpiredTasks() {
        List<Task> expiredTasks = taskRepository.findByDeadlineBefore(LocalDateTime.now());

        if (!expiredTasks.isEmpty()) {
            taskRepository.deleteAll(expiredTasks);
            System.out.println("Deleted " + expiredTasks.size() + " expired tasks.");
        }
    }

    public List<Task> getTasksByStaffId(String staffId) {
        return taskRepository.findByStaffId(staffId);
    }

    public List<TaskSubmission> getSubmittedTasksByStaffId(String staffId) {
        return  taskSubmissionRepository.findByStaffId(staffId);
    }
}
