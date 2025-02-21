package com.collegeApp.back_end.repo;

import com.collegeApp.back_end.model.StaffMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffMessageRepo extends JpaRepository< StaffMessage,Integer > {
}
