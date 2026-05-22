package com.yo.day1.controllers;

import com.yo.day1.common.ApiResponse;
import com.yo.day1.domain.entity.Course;
import com.yo.day1.dto.course.CourseResponse;
import com.yo.day1.dto.course.CourseUpsertRequest;
import com.yo.day1.repository.CourseRepository;
import com.yo.day1.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "api/course")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @GetMapping
    public ResponseEntity<List<CourseResponse>> findAll()
    {
        return ResponseEntity.ok(courseService.findAll());

    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @GetMapping("{id}")
    public ResponseEntity<CourseResponse> findById(@PathVariable Long id)
    {
        return courseService.findById(id).map(ResponseEntity::ok)
                .orElseGet(()-> ResponseEntity.ok().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PostMapping
    public ResponseEntity<CourseResponse> create(@RequestBody CourseUpsertRequest request)
    {
        return ResponseEntity.ok(courseService.create(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PutMapping("{id}")
    public ResponseEntity<CourseResponse> update(@RequestBody CourseUpsertRequest request, @PathVariable Long id)
    {
        return ResponseEntity.ok(courseService.update(request,id));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Long id)
    {
        courseService.delete(id);
        return ResponseEntity.ok("Xoa Course Thanh Cong");
    }

}
