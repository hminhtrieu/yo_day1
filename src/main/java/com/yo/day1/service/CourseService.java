package com.yo.day1.service;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Course;
import com.yo.day1.dto.course.CourseResponse;
import com.yo.day1.dto.course.CourseUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface CourseService {
    List<CourseResponse> findAll();
    List<CourseResponse> findByCourseActive();
    Optional<CourseResponse> findById(Long id);
    CourseResponse create(CourseUpsertRequest request);
    CourseResponse update(CourseUpsertRequest request, Long id);
    void delete(Long id) throws NotFoundException;
}
