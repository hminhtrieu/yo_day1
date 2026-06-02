package com.yo.day1.domain.entity;

import com.yo.day1.domain.AuditableEntity;
import com.yo.day1.domain.enums.TeacherRole;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "teachers")
public class Teacher extends AuditableEntity {
    @Column(name = "teacher_code", columnDefinition = "varchar(20)")
    private String teacherCode;

    @Column(name = "full_name", columnDefinition = "varchar(100)")
    private String fullname;

    @Column(columnDefinition = "varchar(20)")
    private String phone;

    @Column(columnDefinition = "varchar(100)")
    private String email;

    @Enumerated(value = EnumType.STRING)
    private TeacherRole teacherRole = TeacherRole.BOTH;

    @Column(columnDefinition = "varchar(255)")
    private String cccdImageUrl;

    @Column(columnDefinition = "tinyint(1)")
    private boolean isActive = true;

}
