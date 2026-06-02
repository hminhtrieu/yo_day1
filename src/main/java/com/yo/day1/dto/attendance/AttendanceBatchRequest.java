package com.yo.day1.dto.attendance;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceBatchRequest {
    @NotNull
    private Long courseClassId;
    @NotNull
    private LocalDate attendanceDate;
    
    private List<StudentAttendanceRowDto> attendances;
}
