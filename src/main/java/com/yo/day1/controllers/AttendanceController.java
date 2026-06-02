package com.yo.day1.controllers;


import com.yo.day1.common.ApiResponse;
import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.dto.attendance.AttendanceBatchRequest;
import com.yo.day1.dto.attendance.AttendanceCreateRequest;
import com.yo.day1.dto.attendance.AttendanceMatrixResponse;
import com.yo.day1.dto.attendance.AttendanceResponse;
import com.yo.day1.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    public ApiResponse<AttendanceResponse> create(@Valid @RequestBody AttendanceCreateRequest request, Principal principal) throws BadRequestException, NotFoundException {
        return ApiResponse.success("Attendance created", attendanceService.create(request, principal.getName()));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    public ApiResponse<List<AttendanceResponse>> findByClassId(@PathVariable Long classId) {
        return ApiResponse.success(attendanceService.findByClassId(classId));
    }

    @PostMapping("/batch")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','TEACHER')")
    public ApiResponse<List<AttendanceResponse>> createBatch(@Valid @RequestBody AttendanceBatchRequest request, Principal principal) throws BadRequestException, NotFoundException {
        return ApiResponse.success("Batch attendance saved", attendanceService.createBatch(request, principal.getName()));
    }

    @GetMapping("/matrix/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','TEACHER')")
    public ApiResponse<AttendanceMatrixResponse> getMatrix(@PathVariable Long classId) {
        return ApiResponse.success(attendanceService.getMatrix(classId));
    }
}
