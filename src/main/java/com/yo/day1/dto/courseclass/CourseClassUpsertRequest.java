package com.yo.day1.dto.courseclass;


import com.yo.day1.domain.enums.ClassStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
public class CourseClassUpsertRequest {
        @NotBlank @Size(max = 20) String ClassCode;
        @NotBlank @Size(max = 100) String name;
        @NotNull Long courseId;
        @NotNull Long roomId;
        @NotNull Long scheduleSlotId;
        @NotNull Long mainteacherId;
        Long assistantTeacherId;
        @NotNull LocalDate startDate;
        LocalDate endDate;
        @NotNull @Min(1)
        Integer maxStudents;
        @NotNull @DecimalMin("0.0")
        Double tuitionFee;
        @NotNull ClassStatus status;

}
