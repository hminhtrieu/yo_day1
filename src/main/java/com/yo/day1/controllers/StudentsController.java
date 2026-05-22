package com.yo.day1.controllers;


import com.yo.day1.dto.student.StudentResponse;
import com.yo.day1.dto.student.StudentUpsertRequest;
import com.yo.day1.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/students")
public class StudentsController {

    private final StudentService studentService;

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','CASHIER','TEACHER')")
    @GetMapping
    public ResponseEntity<List<StudentResponse>> findAll()
    {
        return ResponseEntity.ok(studentService.findAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','CASHIER','TEACHER')")
    @GetMapping(value = "{id}")
    public ResponseEntity<StudentResponse> findById(@PathVariable Long id)
    {
        return studentService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());

    }
    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PostMapping
    public ResponseEntity<StudentResponse> create(@Valid @RequestBody StudentUpsertRequest request)
    {
        return ResponseEntity.ok(studentService.create(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PutMapping(value = "{id}")
    public ResponseEntity<StudentResponse> update(StudentUpsertRequest request,@PathVariable Long id)
    {
        return ResponseEntity.ok(studentService.update(id,request));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping(value = "{id}")
    public ResponseEntity<?> delete(@PathVariable Long id)
    {
       studentService.delete(id);
       return ResponseEntity.ok("Xoa Student Thanh Cong");
    }
}


