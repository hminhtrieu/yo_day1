package com.yo.day1.service.impl;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Teacher;
import com.yo.day1.dto.teacher.TeacherResponse;
import com.yo.day1.dto.teacher.TeacherUpsertRequest;
import com.yo.day1.repository.TeacherRepository;
import com.yo.day1.service.TeacherService;
import jakarta.persistence.MappedSuperclass;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {
    private final TeacherRepository teacherRepository;
    private final ModelMapper mapper;


    private TeacherResponse map(Teacher teacher)
    {
        return mapper.map(teacher,TeacherResponse.class);
    }

    public List<TeacherResponse> findAll()
    {
        return teacherRepository.findAll().stream()
                .map(s->map(s))
                .toList();
    }

    public Optional<TeacherResponse> findById(Long id)
    {
        return teacherRepository.findById(id).map(this::map);
    }

    public TeacherResponse create(TeacherUpsertRequest req)
    {
        Teacher teacher = mapper.map(req,Teacher.class);
        Teacher result = teacherRepository.save(teacher);
        return map(result);
    }

    public TeacherResponse update(Long id, TeacherUpsertRequest req)
    {
        Teacher teacher = mapper.map(req,Teacher.class);
        teacher.setId(id);
        Teacher result = teacherRepository.save(teacher);
        return map(result);
    }

    public void deleteById(Long id) throws NotFoundException {
        if (teacherRepository.existsById(id))
        {
            teacherRepository.deleteById(id);
        }
        else {
            throw new NotFoundException("Khong Tim Thay Teacher De Xoa");
        }
    }

}
