package com.collegeApp.Back_end.repo;

import com.collegeApp.Back_end.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskStatusRepo extends JpaRepository<TaskStatus,Integer> {
}
