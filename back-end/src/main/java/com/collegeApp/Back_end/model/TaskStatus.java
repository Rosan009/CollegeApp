package com.collegeApp.Back_end.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "taskStatus")
public class TaskStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String staffName;
    private String staffId;
    private String taskTitle;
    private String description;
    private String taskStatus;
}
