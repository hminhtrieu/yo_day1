package com.yo.day1.dto.attendance;

import com.yo.day1.domain.entity.CourseClass;
import com.yo.day1.domain.entity.Student;
import com.yo.day1.domain.entity.User;
import com.yo.day1.domain.enums.AttendanceStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class AttendanceResponse {
 // tai sao ko lam truy xuat... ko duoc de ko truy xuat nen co truy xuat cho tuong minh
    Long id;
    Long courseClassId;
    String className;
    Long studentId;
    String studentName;
    LocalDate attendanceDate;
    String status;
    String note;
    Long recordedByUserId;
    String recordedByUsername;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
