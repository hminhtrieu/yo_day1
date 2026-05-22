package com.yo.day1.controllers;


import com.yo.day1.common.ApiResponse;
import com.yo.day1.dto.room.RoomResponse;
import com.yo.day1.dto.room.RoomUpsertRequest;
import com.yo.day1.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<List<RoomResponse>> findAll()
    {
        return ApiResponse.success(roomService.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomResponse> findById(@PathVariable long id) {
        return roomService.findById(id).map(ApiResponse::success)
                .orElseGet(() -> ApiResponse.error("Not found", new RoomResponse()));
    }

    @PostMapping
    public ApiResponse<RoomResponse> save(@RequestBody RoomUpsertRequest request)
    {
        return ApiResponse.success(roomService.save(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomResponse> save(@RequestBody RoomUpsertRequest request,@PathVariable long id)
    {
        return ApiResponse.success(roomService.save(request,id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id)
    {
        roomService.delete(id);
        return ApiResponse.success("deleted");
    }

}
