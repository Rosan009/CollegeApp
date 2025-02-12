package com.collegeApp.back_end.service;

import com.collegeApp.back_end.model.Task;
import com.collegeApp.back_end.repo.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {
     @Autowired
     private static TaskRepository taskRepository;

    public static Task getTaskById(int taskId) {
       return taskRepository.findById(taskId).orElse(null);
    }

    public List<Task> getTasksByStaffId(String staffId) {
        return taskRepository.findByStaffId(staffId);
    }
}

