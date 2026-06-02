package com.yo.day1.service;

import com.yo.day1.dto.report.CourseRevenueResponse;
import com.yo.day1.dto.report.DashboardStatsResponse;
import com.yo.day1.dto.report.MonthlyRevenueResponse;

import java.util.List;

public interface ReportService {
    DashboardStatsResponse getDashboardStats();
    List<MonthlyRevenueResponse> getMonthlyRevenue(int year);
    List<CourseRevenueResponse> getCourseRevenue(int year, Integer month);
}
