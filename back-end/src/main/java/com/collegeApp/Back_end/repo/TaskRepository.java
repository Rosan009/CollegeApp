package com.collegeApp.back_end.repo;

import com.collegeApp.back_end.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task,Integer> {
}
