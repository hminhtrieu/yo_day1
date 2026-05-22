package com.yo.day1.controllers;


import com.yo.day1.common.ApiResponse;
import com.yo.day1.dto.courseclass.CourseClassResponse;
import com.yo.day1.dto.courseclass.CourseClassUpsertRequest;
import com.yo.day1.repository.CourseClassRepository;
import com.yo.day1.service.CourseClassService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courseclass")
@RequiredArgsConstructor
public class CourseClassController {
    private final CourseClassService courseClassService;

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @GetMapping
    public ApiResponse<List<CourseClassResponse>> findAll()
    {
        return ApiResponse.success(courseClassService.findAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @GetMapping("/{id}")
    public ApiResponse<CourseClassResponse> findById(@PathVariable long id)
    {
        return courseClassService.findById(id).map(ApiResponse::success)
                .orElseGet(() -> ApiResponse.error("Not found", new CourseClassResponse()));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PostMapping
    public ApiResponse<CourseClassResponse> create(@RequestBody CourseClassUpsertRequest request)
    {
        return ApiResponse.success(courseClassService.create(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PutMapping("/{id}")
    public ApiResponse<CourseClassResponse> update(@RequestBody CourseClassUpsertRequest request, @PathVariable long id)
    {
        return ApiResponse.success(courseClassService.update(id,request));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id)
    {
        courseClassService.delete(id);
        return ApiResponse.success("deleted");
    }
}
