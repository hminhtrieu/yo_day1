package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.dto.enrollment.EnrollmentCreateRequest;
import com.yo.day1.dto.enrollment.EnrollmentResponse;
import com.yo.day1.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PostMapping
    public ApiResponse<EnrollmentResponse> create(@RequestBody EnrollmentCreateRequest request) {
        return ApiResponse.success(enrollmentService.create(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','TEACHER')")
    @GetMapping("/class/{classId}")
    public ApiResponse<List<EnrollmentResponse>> findByClassId(@PathVariable Long classId) {
        return ApiResponse.success(enrollmentService.findByClassId(classId));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','TEACHER','PARENT')")
    @GetMapping("/student/{studentId}")
    public ApiResponse<List<EnrollmentResponse>> findByStudentId(@PathVariable Long studentId) {
        return ApiResponse.success(enrollmentService.findByStudentId(studentId));
    }
}
