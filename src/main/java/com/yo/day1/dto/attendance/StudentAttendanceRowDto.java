package com.yo.day1.dto.attendance;

import com.yo.day1.domain.enums.AttendanceStatus;
import lombok.Data;

@Data
public class StudentAttendanceRowDto {
    private Long studentId;
    private AttendanceStatus status;
    private String note;
}
