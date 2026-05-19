package com.yo.day1.repository;

import com.yo.day1.domain.entity.Course;
import com.yo.day1.domain.entity.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseClassRepository extends JpaRepository<CourseClass,Long> {
}
