package com.collegeApp.back_end.service;

import com.collegeApp.back_end.model.StaffMessage;
import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.StaffMessageRepo;
import com.collegeApp.back_end.repo.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class StaffService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private StaffMessageRepo staffMessageRepo;

    public List<Task> getTasksByStaffId(String staffId) {
        return taskRepository.findByStaffId(staffId);
    }

    public Task getTaskById(int taskId) {
        return taskRepository.findById(taskId).orElse(null);
    }

    public void saveTask(StaffMessage task, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            task.setFileName(file.getOriginalFilename());
            task.setFileType(file.getContentType());
            task.setFileData(file.getBytes());
        }

        staffMessageRepo.save(task);
    }
}

