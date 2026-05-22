package com.yo.day1.controllers;


import com.yo.day1.common.ApiResponse;
import com.yo.day1.dto.courseclass.CourseClassResponse;
import com.yo.day1.dto.courseclass.CourseClassUpsertRequest;
import com.yo.day1.repository.CourseClassRepository;
import com.yo.day1.service.CourseClassService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courseclass")
@RequiredArgsConstructor
public class CourseClassController {
    private final CourseClassService courseClassService;

    @GetMapping
    public ApiResponse<List<CourseClassResponse>> findAll()
    {
        return ApiResponse.success(courseClassService.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<CourseClassResponse> findById(@PathVariable long id)
    {
        return courseClassService.findById(id).map(ApiResponse::success)
                .orElseGet(() -> ApiResponse.error("Not found", new CourseClassResponse()));
    }

    @PostMapping
    public ApiResponse<CourseClassResponse> create(@RequestBody CourseClassUpsertRequest request)
    {
        return ApiResponse.success(courseClassService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<CourseClassResponse> update(@RequestBody CourseClassUpsertRequest request, @PathVariable long id)
    {
        return ApiResponse.success(courseClassService.update(id,request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id)
    {
        courseClassService.delete(id);
        return ApiResponse.success("deleted");
    }
}
