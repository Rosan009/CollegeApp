package com.collegeApp.Back_end.repo;

import com.collegeApp.Back_end.model.TaskSubmission;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Integer> {
    List<TaskSubmission> findByStaffId(String staffId);
}