package com.collegeApp.Back_end.repo;

import com.collegeApp.Back_end.model.TaskSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Integer> {
}