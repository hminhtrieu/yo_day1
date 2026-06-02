package com.yo.day1.domain.entity;

import com.yo.day1.domain.AuditableEntity;
import com.yo.day1.domain.enums.ClassStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "course_classes")
public class CourseClass extends AuditableEntity {
    @Column(name = "class_code",columnDefinition = "varchar(20)")
    private String classCode;
    @Column(columnDefinition = "varchar(100)")
    private String name;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false )
    private Course course;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false )
    private Room room;

    @ManyToOne
    @JoinColumn(name = "schedule_slot_id", nullable = false )
    private ScheduleSlot slot;

    @ManyToOne
    @JoinColumn(name = "main_teacher_id", nullable = false )
    private Teacher mainTeacher;

    @ManyToOne
    @JoinColumn(name = "assistant_teacher_id" )
    private Teacher assistantTeacher;

    @Column(name = "start_time")
    private LocalDate startTime;

    @Column(name = "end_time")
    private LocalDate endTime;

    @Column(name = "max_students")
    private int maxStudents;

    @Column(name = "tuition_fee", columnDefinition = "decimal(12,2)")
    private float tuitionFee;

    @Enumerated(EnumType.STRING)
    private ClassStatus status = ClassStatus.OPEN;
}
