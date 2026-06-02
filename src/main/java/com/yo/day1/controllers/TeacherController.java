package com.yo.day1.controllers;

import com.yo.day1.dto.teacher.TeacherResponse;
import com.yo.day1.dto.teacher.TeacherUpsertRequest;
import com.yo.day1.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "api/teacher")
@RequiredArgsConstructor
public class TeacherController {
    private final TeacherService teacherService;

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','TEACHER')")
    @GetMapping
    public ResponseEntity<List<TeacherResponse>> findAll()
    {
        return ResponseEntity.ok(teacherService.findAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @GetMapping("{id}")
    public ResponseEntity<TeacherResponse> findById(@PathVariable Long id)
    {
        return teacherService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PostMapping
    public ResponseEntity<TeacherResponse> create(@RequestBody TeacherUpsertRequest request)
    {
        return ResponseEntity.ok(teacherService.create(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PutMapping("{id}")
    public ResponseEntity<TeacherResponse> update(@RequestBody TeacherUpsertRequest request, @PathVariable Long id)
    {
        return ResponseEntity.ok(teacherService.update(id,request));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id)
    {
        teacherService.deleteById(id);
        return ResponseEntity.ok("Xoa Teacher Thanh Cong");
    }
}

