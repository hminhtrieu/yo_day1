package com.yo.day1.dto.learningresult;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LearningResultResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseClassId;
    private String className;
    private LocalDate resultMonth;
    private BigDecimal score;
    private String teacherComment;
    private Long createdByUserId;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
