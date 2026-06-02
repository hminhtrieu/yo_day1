package com.yo.day1.domain.entity;


import com.yo.day1.domain.AuditableEntity;
import com.yo.day1.domain.enums.TeacherRole;
import com.yo.day1.domain.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User extends AuditableEntity {

    @Column(nullable = false,unique = true,columnDefinition = "varchar(100)")
    private String username;

    @Column(name = "password_hash",nullable = false, columnDefinition = "varchar(100)")
    private String passwordHash;

    @Column(name = "full_name",nullable = false, columnDefinition = "varchar(50)")
    private String fullName;

    @Column(columnDefinition = "varchar(20)")
    private String phone;

    @Column(columnDefinition = "varchar(100)")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 20)
    private UserRole role;

    @Column(nullable = false,length = 20)
    @Enumerated(EnumType.STRING)
    private TeacherRole teacherRole;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @Column(name = "is_active",nullable = false)
    private Boolean isActive = true;
}
