package com.yo.day1.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRevenueResponse {
    private String courseName;
    private float revenue;
}
