package com.collegeApp.back_end.repo;

import com.collegeApp.back_end.model.StaffMessage;
import com.collegeApp.back_end.model.Task;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@Transactional
public interface StaffMessageRepo extends JpaRepository< StaffMessage,Integer > {
    List<StaffMessage> findByStaffId(String staffId);

    List<StaffMessage> findByCreatedAtBefore(LocalDateTime dateTime);
}
