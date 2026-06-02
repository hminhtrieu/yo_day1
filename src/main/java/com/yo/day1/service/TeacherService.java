package com.yo.day1.service;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Teacher;
import com.yo.day1.dto.teacher.TeacherResponse;
import com.yo.day1.dto.teacher.TeacherUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface TeacherService {

    List<TeacherResponse> findAll();
    Optional<TeacherResponse> findById(Long id);
    TeacherResponse create(TeacherUpsertRequest req);
    TeacherResponse update(Long id, TeacherUpsertRequest req);
    void deleteById(Long id) throws NotFoundException;
}
