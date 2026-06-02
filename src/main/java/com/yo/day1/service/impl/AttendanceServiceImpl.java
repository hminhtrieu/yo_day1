package com.yo.day1.service.impl;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.*;
import com.yo.day1.domain.enums.AttendanceStatus;
import com.yo.day1.domain.enums.NotificationRecipientType;
import com.yo.day1.domain.enums.NotificationType;
import com.yo.day1.dto.attendance.AttendanceCreateRequest;
import com.yo.day1.dto.attendance.AttendanceBatchRequest;
import com.yo.day1.dto.attendance.AttendanceMatrixResponse;
import com.yo.day1.dto.attendance.StudentAttendanceRowDto;
import com.yo.day1.dto.attendance.AttendanceResponse;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import com.yo.day1.repository.AttendanceRepository;
import com.yo.day1.repository.CourseClassRepository;
import com.yo.day1.repository.NotificationRepository;
import com.yo.day1.repository.StudentRepository;
import com.yo.day1.service.AttendanceService;
import com.yo.day1.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;
    private final CourseClassRepository courseClassRepository;
    private final AuthService authService;
    private final ModelMapper mapper;


        @Transactional
        public AttendanceResponse create(AttendanceCreateRequest request, String username) throws BadRequestException, NotFoundException {
            CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId()).orElse(null);
            Student student = studentRepository.findById(request.getStudentId()).orElse(null);

//            validateAttendanceDate(courseClass, request.getAttendanceDate());

//        enrollmentService.getEnrollment(request.studentId(), request.courseClassId());

            if (attendanceRepository.existsByCourseClassIdAndStudentIdAndAttendanceDate(
                    request.getCourseClassId(), request.getStudentId(), request.getAttendanceDate())) {
                throw new BadRequestException(duplicateAttendanceMessage(request));
            }

            Attendance attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setCourseClass(courseClass);
            attendance.setAttendanceDate(request.getAttendanceDate());
            attendance.setStatus(request.getStatus());
            attendance.setNote(request.getNote());
            User recorder = authService.findActiveUserByUsername(username);
            attendance.setRecordedByUser(recorder);
            Attendance saved;
            try {
                saved = attendanceRepository.save(attendance);
            } catch (DataIntegrityViolationException ex) {
                if (attendanceRepository.existsByCourseClassIdAndStudentIdAndAttendanceDate(
                        request.getCourseClassId(), request.getStudentId(), request.getAttendanceDate())) {
                    throw new BadRequestException(duplicateAttendanceMessage(request));
                }
                throw ex;
            }

            if (request.getStatus() == AttendanceStatus.ABSENT && saved.getStudent().getParent() != null) {
                Notification notification = new Notification();
                notification.setRecipientType(NotificationRecipientType.PARENT);
                notification.setRecipientRefId(saved.getStudent().getParent().getId());
                notification.setStudent(saved.getStudent());
                notification.setType(NotificationType.ABSENCE);
                notification.setTitle("Thông báo vắng học");
                notification.setContent("Học viên " + saved.getStudent().getFullname() + " vắng buổi học ngày "
                        + saved.getAttendanceDate() + ".");
                notification.setRelatedEntityType("attendance");
                notification.setRelatedEntityId(saved.getId());
                notificationRepository.save(notification);
            }
            return toResponse(saved);
        }

        @Transactional(readOnly = true)
        public List<AttendanceResponse> findByClassId(Long classId) {
            courseClassRepository.findById(classId);
            return attendanceRepository.findByCourseClassId(classId).stream().map(this::toResponse).toList();
        }

        @Transactional
        public List<AttendanceResponse> createBatch(AttendanceBatchRequest request, String username) throws BadRequestException, NotFoundException {
            CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId()).orElseThrow(() -> new NotFoundException("Course class not found"));
            User recorder = authService.findActiveUserByUsername(username);

            List<Attendance> attendancesToSave = new ArrayList<>();
            for (StudentAttendanceRowDto row : request.getAttendances()) {
                Student student = studentRepository.findById(row.getStudentId()).orElseThrow(() -> new NotFoundException("Student not found"));
                
                // If exists, update. If not, create new
                Attendance attendance = attendanceRepository.findByCourseClassId(request.getCourseClassId())
                        .stream().filter(a -> a.getStudent().getId().equals(row.getStudentId()) && a.getAttendanceDate().equals(request.getAttendanceDate()))
                        .findFirst().orElse(new Attendance());
                
                attendance.setStudent(student);
                attendance.setCourseClass(courseClass);
                attendance.setAttendanceDate(request.getAttendanceDate());
                attendance.setStatus(row.getStatus());
                attendance.setNote(row.getNote());
                attendance.setRecordedByUser(recorder);
                attendancesToSave.add(attendance);
            }
            
            return attendanceRepository.saveAll(attendancesToSave).stream().map(this::toResponse).toList();
        }

        @Transactional(readOnly = true)
        public AttendanceMatrixResponse getMatrix(Long classId) {
            CourseClass courseClass = courseClassRepository.findById(classId).orElseThrow();
            List<Attendance> allAttendances = attendanceRepository.findByCourseClassId(classId);
            
            AttendanceMatrixResponse response = new AttendanceMatrixResponse();
            
            // Get unique students from attendances and course class
            List<AttendanceMatrixResponse.StudentInfo> students = new ArrayList<>();
            // We should get all enrolled students for this class. For now, since we don't have EnrollmentRepository autowired, 
            // we will extract students from the existing attendance records.
            // Wait, this is better: Extract from attendance records.
            Map<Long, AttendanceMatrixResponse.StudentInfo> studentMap = new HashMap<>();
            
            List<LocalDate> dates = allAttendances.stream().map(Attendance::getAttendanceDate).distinct().sorted().toList();
            
            Map<Long, Map<LocalDate, AttendanceStatus>> matrix = new HashMap<>();
            Map<Long, Map<LocalDate, String>> notes = new HashMap<>();
            
            for (Attendance a : allAttendances) {
                Long sid = a.getStudent().getId();
                if (!studentMap.containsKey(sid)) {
                    AttendanceMatrixResponse.StudentInfo si = new AttendanceMatrixResponse.StudentInfo();
                    si.setId(sid);
                    si.setFullname(a.getStudent().getFullname());
                    si.setStudentCode(a.getStudent().getStudentCode());
                    studentMap.put(sid, si);
                }
                matrix.computeIfAbsent(sid, k -> new HashMap<>()).put(a.getAttendanceDate(), a.getStatus());
                if (a.getNote() != null) {
                    notes.computeIfAbsent(sid, k -> new HashMap<>()).put(a.getAttendanceDate(), a.getNote());
                }
            }
            
            response.setStudents(new ArrayList<>(studentMap.values()));
            response.setDates(dates);
            response.setMatrix(matrix);
            response.setNotes(notes);
            
            return response;
        }

        private void validateAttendanceDate(CourseClass courseClass, LocalDate attendanceDate) throws BadRequestException {
            if (attendanceDate.isBefore(courseClass.getStartTime())) {
                throw new BadRequestException("Attendance date must not be before class start date");
            }
            if (courseClass.getEndTime() != null && attendanceDate.isAfter(courseClass.getEndTime())) {
                throw new BadRequestException("Attendance date must not be after class end date");
            }
            if (courseClass.getSlot() != null
                    && !matchesScheduledWeekday(attendanceDate, (int) courseClass.getSlot().getWeekDay())) {
                throw new BadRequestException("Attendance date does not match the class schedule");
            }
        }

        private boolean matchesScheduledWeekday(LocalDate attendanceDate, Integer scheduledWeekday) {
            if (scheduledWeekday == null) {
                return true;
            }

            int isoWeekday = attendanceDate.getDayOfWeek().getValue();
            // Accept both ISO weekday numbering (Mon=1) and existing VN-style seed data
            // (Mon=2).
            int vnStyleWeekday = isoWeekday == 7 ? 8 : isoWeekday + 1;
            return scheduledWeekday == isoWeekday || scheduledWeekday == vnStyleWeekday;
        }

        private String duplicateAttendanceMessage(AttendanceCreateRequest request) {
            return "Attendance already exists for student " + request.getStudentId()
                    + " in class " + request.getCourseClassId()
                    + " on " + request.getAttendanceDate();
        }

        private AttendanceResponse toResponse(Attendance attendance) {
            AttendanceResponse result = mapper.map(attendance, AttendanceResponse.class);
            result.setCourseClassId(attendance.getCourseClass().getId());
            result.setClassName(attendance.getCourseClass().getName());
            result.setStudentId(attendance.getStudent().getId());
            result.setStudentName(attendance.getStudent().getFullname());
            result.setStatus(attendance.getStatus().name());
            result.setRecordedByUserId(attendance.getRecordedByUser().getId());
            result.setRecordedByUsername(attendance.getRecordedByUser().getUsername());

            return result;
        }
    }

