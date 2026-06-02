package com.yo.day1.domain.entity;


import com.yo.day1.domain.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "rooms")
public class Room extends AuditableEntity {
    @Column(columnDefinition = "varchar20")
    private String roomCode;

    @Column(columnDefinition = "varchar100")
    private String name;


    private int capacity;

    @Column(columnDefinition = "varchar255")
    private String description;
}

