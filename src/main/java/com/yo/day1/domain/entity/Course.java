package com.yo.day1.domain.entity;

import com.yo.day1.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "courses")
public class Course extends AuditableEntity {
    @Column(columnDefinition = "varchar(20)")
    private String courseCode;
    @Column(columnDefinition = "varchar(100)")
    private String name;
    @Column(columnDefinition = "text")
    private String decscription;
    private double tuitionFee;

    private int totalSessions;
    @Column(columnDefinition = "is_active")
    private byte isActive;
}
