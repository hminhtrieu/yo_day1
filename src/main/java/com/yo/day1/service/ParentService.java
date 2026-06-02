package com.yo.day1.service;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Parent;
import com.yo.day1.dto.course.CourseResponse;
import com.yo.day1.dto.course.CourseUpsertRequest;
import com.yo.day1.dto.parent.ParentResponse;
import com.yo.day1.dto.parent.ParentUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface ParentService {
    List<ParentResponse> findAll();
    Optional<ParentResponse> findById(Long id);
    ParentResponse create(ParentUpsertRequest request);
    ParentResponse update(ParentUpsertRequest request, Long id);
    void deleteById(Long id) throws NotFoundException;
}
