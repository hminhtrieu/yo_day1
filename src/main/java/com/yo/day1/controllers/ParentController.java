package com.yo.day1.controllers;

import com.yo.day1.domain.entity.Parent;
import com.yo.day1.dto.parent.ParentResponse;
import com.yo.day1.dto.parent.ParentUpsertRequest;
import com.yo.day1.service.ParentService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/parent")
@RequiredArgsConstructor
public class ParentController {
    private final ParentService parentService;

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF','CASHIER','TEACHER')")
    @GetMapping
    public ResponseEntity<List<ParentResponse>> findAll()
    {
        return ResponseEntity.ok(parentService.findAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @GetMapping("{id}")
    public ResponseEntity<ParentResponse> findById(@PathVariable Long id)
    {
        return parentService.findById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PostMapping
    public ResponseEntity<ParentResponse> create(@RequestBody ParentUpsertRequest req)
    {
        return ResponseEntity.ok(parentService.create(req));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ACADEMIC_STAFF')")
    @PutMapping("{id}")
    public ResponseEntity<ParentResponse> update(@RequestBody ParentUpsertRequest req, @PathVariable Long id)
    {
        return ResponseEntity.ok(parentService.update(req,id));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id)
    {
        parentService.deleteById(id);
        return ResponseEntity.ok("Xoa Parent Thanh Cong");
    }
}
