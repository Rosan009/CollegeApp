package com.collegeApp.Back_end.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "taskSubmission")
public class TaskSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String staffId;
    private String title;
    private String description;
    private String fileName;
    private String fileType;

    @Lob
    private byte[] fileData;

    private String message;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime submittedAt;

}
