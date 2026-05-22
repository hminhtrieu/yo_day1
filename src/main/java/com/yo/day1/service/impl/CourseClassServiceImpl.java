package com.yo.day1.service.impl;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Course;
import com.yo.day1.domain.entity.CourseClass;
import com.yo.day1.dto.courseclass.CourseClassResponse;
import com.yo.day1.dto.courseclass.CourseClassUpsertRequest;
import com.yo.day1.repository.*;
import com.yo.day1.service.CourseClassService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CourseClassServiceImpl implements CourseClassService {
    private final CourseClassRepository courseClassRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;

    private final ModelMapper mapper;
    private final RoomRepository roomRepository;

    private CourseClassResponse map(CourseClass cc)
    {
        return mapper.map(cc,CourseClassResponse.class);
    }

    public List<CourseClassResponse> findAll()
    {
        return courseClassRepository.findAll().stream()
                .map(this::map)
                .toList();
    }

    public Optional<CourseClassResponse> findById(Long id)
    {
        return courseClassRepository.findById(id)
                .map(this::map);

    }

    public void CoppyToCourseClass (CourseClass cc,CourseClassUpsertRequest request)
    {
        if(request.getCourseId() != null)
        {
            courseRepository.findById(request.getCourseId()).ifPresent(cc::setCourse);
        }
        if (request.getScheduleSlotId() != null)
        {
            roomRepository.findById(request.getRoomId()).ifPresent(cc::setRoom);
        }
        if (request.getMainteacherId() != null)
        {
            teacherRepository.findById(request.getMainteacherId()).ifPresent(cc::setMainTeacher);
        }
        if (request.getAssistantTeacherId() != null)
        {
            teacherRepository.findById(request.getAssistantTeacherId()).ifPresent(cc::setAssistantTeacher);
        }

    }

    public CourseClassResponse create(CourseClassUpsertRequest request)
    {
        CourseClass cc = mapper.map(request,CourseClass.class);
        CoppyToCourseClass(cc,request);
        return map(courseClassRepository.save(cc));

    }

    public CourseClassResponse update(Long id, CourseClassUpsertRequest request){
        Optional<CourseClass> courseClass = courseClassRepository.findById(id);

        if(courseClass.isPresent()){
            CourseClass cc = courseClass.get();
            CoppyToCourseClass(cc,request);

            return map(courseClassRepository.save(cc));
        }else{
            throw new NotFoundException("Course not exists");
        }

    }

    public void delete(Long id)
    {
        courseRepository.deleteById(id);
    }


}
