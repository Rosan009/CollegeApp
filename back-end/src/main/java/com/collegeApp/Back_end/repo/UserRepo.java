package com.collegeApp.back_end.repo;

import com.collegeApp.back_end.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Integer> {
}
