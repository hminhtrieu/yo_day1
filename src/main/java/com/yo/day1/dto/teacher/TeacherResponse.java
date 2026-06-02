package com.yo.day1.dto.teacher;

import com.yo.day1.domain.enums.TeacherRole;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherResponse {

    private Long id;
    private String teacherCode;

    private String fullname;

    private String phone;

    private String email;

    private TeacherRole teacherRole;

    private String cccdImageUrl;

    private boolean isActive = true;
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
