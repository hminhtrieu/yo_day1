package com.yo.day1.dto.attendance;

import com.yo.day1.domain.enums.AttendanceStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class AttendanceMatrixResponse {
    
    @Data
    public static class StudentInfo {
        private Long id;
        private String fullname;
        private String studentCode;
    }

    private List<StudentInfo> students;
    private List<LocalDate> dates;
    private Map<Long, Map<LocalDate, AttendanceStatus>> matrix;
    private Map<Long, Map<LocalDate, String>> notes;
}
