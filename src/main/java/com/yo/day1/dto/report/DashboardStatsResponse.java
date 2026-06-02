package com.yo.day1.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long studentsCount;
    private long coursesCount;
    private long classesCount;
    private float currentMonthRevenue;
    private long unpaidInvoicesCount;
}
