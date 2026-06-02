package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.dto.report.CourseRevenueResponse;
import com.yo.day1.dto.report.DashboardStatsResponse;
import com.yo.day1.dto.report.MonthlyRevenueResponse;
import com.yo.day1.service.ReportService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Endpoints for admin dashboard statistics")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    public ApiResponse<DashboardStatsResponse> getDashboardStats() {
        return ApiResponse.success("Dashboard stats retrieved", reportService.getDashboardStats());
    }

    @GetMapping("/revenue/monthly")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','CASHIER')")
    public ApiResponse<List<MonthlyRevenueResponse>> getMonthlyRevenue(@RequestParam int year) {
        return ApiResponse.success("Monthly revenue retrieved", reportService.getMonthlyRevenue(year));
    }

    @GetMapping("/revenue/course")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','CASHIER')")
    public ApiResponse<List<CourseRevenueResponse>> getCourseRevenue(@RequestParam int year, @RequestParam(required = false) Integer month) {
        return ApiResponse.success("Course revenue retrieved", reportService.getCourseRevenue(year, month));
    }
}
