package com.collegeApp.back_end.repo;

import com.collegeApp.back_end.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {
     Optional<User> findByUsername(String username);}
