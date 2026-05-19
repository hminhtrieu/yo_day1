package com.yo.day1.service.impl;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Course;
import com.yo.day1.dto.course.CourseResponse;
import com.yo.day1.dto.course.CourseUpsertRequest;
import com.yo.day1.repository.CourseRepository;
import com.yo.day1.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final ModelMapper mapper;

    private CourseResponse map(Course course)
    {
        return mapper.map(course,CourseResponse.class);
    }

    public List<CourseResponse> findAll()
    {
        return courseRepository.findAll().stream()
                .map(s-> map(s))
                .toList();
    }

    @Override
    public List<CourseResponse> findByCourseActive()
    {
        return courseRepository.findByCourseActive();
    }
    public Optional<CourseResponse> findById(Long id)
    {
        return courseRepository.findById(id).map(this::map);
    }

    public CourseResponse create(CourseUpsertRequest request)
    {
        Course course = mapper.map(request,Course.class);
        Course result = courseRepository.save(course);
        return map(result);
    }

    public CourseResponse update(CourseUpsertRequest request, Long id)
    {
        Course course = mapper.map(request,Course.class);
        course.setId(id);
        Course result = courseRepository.save(course);
        return map(result);
    }

    public void delete(Long id) throws NotFoundException
    {
       if(courseRepository.existsById(id))
       {
           courseRepository.deleteById(id);
       }
       else
       {
           throw new NotFoundException("Khong Tim Thay Course");
       }
    }


}
