package com.yo.day1.dto.courseclass;


import com.yo.day1.domain.entity.Course;
import com.yo.day1.domain.entity.Room;
import com.yo.day1.domain.entity.ScheduleSlot;
import com.yo.day1.domain.entity.Teacher;
import com.yo.day1.domain.enums.ClassStatus;
import com.yo.day1.dto.course.CourseResponse;
import com.yo.day1.dto.room.RoomResponse;
import com.yo.day1.dto.teacher.TeacherResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseClassResponse {

    private Long id;
    private String classCode;
    private String name;
    private CourseResponse course;
    private RoomResponse room;
    private ScheduleSlot slot;
    private TeacherResponse mainTeacher;
    private TeacherResponse assistantTeacher;
    private LocalDate startTime;
    private LocalDate endTime;
    private int maxStudents;
    private Double tuitionFee;
    private ClassStatus status;
}
