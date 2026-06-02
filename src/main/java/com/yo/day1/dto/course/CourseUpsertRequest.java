package com.yo.day1.dto.course;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseUpsertRequest {
    @Size(min = 2, max = 10)
    private String courseCode;

    @Size(min = 2, max = 20)
    private String name;

    @Size(max = 500)
    private String decsciption;

    @PositiveOrZero
    private double tuitionFee;

    @Min(1)
    private int totalSessions;

    @Min(0)
    @Max(1)
    private byte isActive;
}
