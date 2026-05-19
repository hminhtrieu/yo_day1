package com.yo.day1.domain.entity;

import com.yo.day1.domain.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalTime;


@Entity
@Data
@Table(name = "schedule_slots")
public class ScheduleSlot extends AuditableEntity {

    @Column(name = "slot_code",columnDefinition = "varchar(20)")
    private String slotCode;

    @Column(name = "weekday")
    private byte weekDay;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "note",columnDefinition = "varchar(255)")
    private String note;
}
