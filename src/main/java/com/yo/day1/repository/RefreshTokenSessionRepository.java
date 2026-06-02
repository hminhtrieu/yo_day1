package com.yo.day1.repository;

import com.yo.day1.domain.entity.RefreshTokenSession;
import com.yo.day1.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenSessionRepository extends JpaRepository<RefreshTokenSession,Long> {
    Optional<RefreshTokenSession> findByJti(String jti);
//    Optional<User> findByUser_Username(String username);
    List<RefreshTokenSession> findByUserIdAndRevokedAtIsNull(Long userid);
    List<RefreshTokenSession> findByExpiresAtBeforeAndRevokedAtIsNull(Instant now);
}
