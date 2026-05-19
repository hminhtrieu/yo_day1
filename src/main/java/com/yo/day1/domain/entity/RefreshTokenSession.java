package com.yo.day1.domain.entity;


import com.yo.day1.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Data
@Table(name = "refresh_token_sessions")
public class RefreshTokenSession extends AuditableEntity {

    @Column(nullable = false,length = 100)
    private String jti;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expire_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "replaced_by_jti",length = 50)
    private String replaceByJti;


}
