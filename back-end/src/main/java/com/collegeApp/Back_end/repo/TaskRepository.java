package com.collegeApp.back_end.repo;


import com.collegeApp.back_end.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByStaffId(Long staffId);
}
