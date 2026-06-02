package com.yo.day1.dto.learningresult;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class LearningResultCreateRequest {

    @NotNull
    private Long studentId;
    @NotNull
    private Long courseClassId;
    @NotNull
    private LocalDate resultMonth;
    @DecimalMin("0.0")
    private BigDecimal score;
    private String teacherComment;
}
