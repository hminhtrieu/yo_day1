package com.yo.day1.dto.course;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {

    private Long id;
    private String courseCode;

    private String name;

    private String decsciption;
    private double tuitionFee;

    private int totalSessions;
    private byte isActive;
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
