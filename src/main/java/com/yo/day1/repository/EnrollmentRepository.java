package com.yo.day1.repository;

import com.yo.day1.domain.entity.Enrollment;
import com.yo.day1.domain.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment,Long> {
    boolean existsByStudentIdAndCourseClassId(Long studentId, Long courseClassId);

    long countByCourseClassIdAndStatus(Long courseClassId, EnrollmentStatus status);

    List<Enrollment> findByCourseClassId(Long courseClassId);

    Optional<Enrollment> findByStudentIdAndCourseClassId(Long studentId, Long courseClassId);

    List<Enrollment> findByStudentId(Long studentId);
}
