package com.yo.day1.dto.student;

import com.yo.day1.domain.entity.Parent;
import com.yo.day1.domain.enums.Gender;
import com.yo.day1.domain.enums.StudentStatus;
import com.yo.day1.dto.parent.ParentResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse {

    private Long id;

    private String studentCode;


    private String fullname;


    private LocalDate dateOfBirth;

    private String gradeLevel;


    private String schoolName;


    private float lastScore;


    private String note;


    private String phone;


    private Gender gender = Gender.OTHER;

    private ParentResponse parent;

    private StudentStatus status = StudentStatus.ACTIVE;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
