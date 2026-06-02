package com.yo.day1.service;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.dto.attendance.AttendanceCreateRequest;
import com.yo.day1.dto.attendance.AttendanceResponse;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface AttendanceService {
    List<AttendanceResponse> findByClassId(Long classId);
    AttendanceResponse create(AttendanceCreateRequest request, String username) throws BadRequestException, NotFoundException;
}
