package com.collegeApp.back_end.repo;

import com.collegeApp.back_end.model.Task;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Transactional
public interface TaskRepository extends JpaRepository<Task,Integer> {
    List<Task> findByStaffId(String staffId);

    Optional<Task> findByFileName(String fileName);
}
