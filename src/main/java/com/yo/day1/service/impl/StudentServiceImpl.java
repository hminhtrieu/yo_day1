package com.yo.day1.service.impl;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Student;
import com.yo.day1.dto.parent.ParentResponse;
import com.yo.day1.dto.student.StudentResponse;
import com.yo.day1.dto.student.StudentUpsertRequest;
import com.yo.day1.repository.ParentRepository;
import com.yo.day1.repository.StudentRepository;
import com.yo.day1.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ModelMapper mapper;



    public List<StudentResponse> findAll()
    {
        return studentRepository.findAll().stream()
                .map(s->map(s))
                .toList();
    }

    private StudentResponse map(Student student)
    {
        return mapper.map(student,StudentResponse.class);
    }

    public Optional<StudentResponse> findById(long id)
    {
       return studentRepository.findById(id).map(this::map);
    }

    public StudentResponse create(StudentUpsertRequest req)
    {
        Student stu = mapper.map(req,Student.class);
        parentRepository.findById(req.getParentId()).ifPresent(p->stu.setParent(p));
        Student result = studentRepository.save(stu);
        return map(result);
    }

    public StudentResponse update(Long id,StudentUpsertRequest req)
    {
        Student stu = mapper.map(req,Student.class);
        stu.setId(id);
        parentRepository.findById(req.getParentId()).ifPresent(p->stu.setParent(p));
        Student result = studentRepository.save(stu);
        return map(result);
    }

    public void delete(Long id) throws NotFoundException
    {
        if(studentRepository.existsById(id))
        {
            studentRepository.deleteById(id);
        }
        else
        {
            throw new NotFoundException("Khong Tim thay");
        }

    }

    private StudentResponse map2(Student student)
    {
        StudentResponse result = new StudentResponse();
        ParentResponse pResult = new ParentResponse();
        if(student.getParent() != null)
        {
            pResult.setId(student.getParent().getId());
            pResult.setFullname(student.getParent().getFullname());
            pResult.setAddress(student.getParent().getAddress());
            pResult.setPhone(student.getParent().getPhone());
            pResult.setEmail(student.getParent().getEmail());
            pResult.setRelationship(student.getParent().getRelationship());

        }

        result.setId(student.getId());
        result.setFullname(student.getFullname());
        result.setPhone(student.getPhone());
        result.setGender(student.getGender());
        result.setNote(student.getNote());
        result.setGradeLevel(student.getGradeLevel());
        result.setDateOfBirth(student.getDateOfBirth());
        result.setStudentCode(student.getSchoolName());

        return result;

    }
    @Transactional(readOnly = true)
    public Student getStudentForParent(Long studentId, Long parentId) throws NotFoundException {
        Student student = getStudent(studentId);
        if (student.getParent() == null || !student.getParent().getId().equals(parentId)) {
            throw new org.springframework.security.access.AccessDeniedException("Student does not belong to current parent account");
        }
        return student;
    }

    public Student getStudent(Long id) throws NotFoundException {
        return studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Student not found: " + id));
    }
    @Transactional(readOnly = true)
    public List<StudentResponse> findByParentId(Long parentId) {
        return studentRepository.findByParentId(parentId).stream().map(this::map).toList();
    }
}
