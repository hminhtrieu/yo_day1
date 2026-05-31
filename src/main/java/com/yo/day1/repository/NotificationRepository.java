package com.yo.day1.repository;

import com.yo.day1.domain.entity.Notification;
import com.yo.day1.domain.enums.NotificationRecipientType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification,Long> {
    List<Notification> findByRecipientTypeAndRecipientRefIdOrderByCreatedAtDesc(NotificationRecipientType notificationRecipientType,Long parentId);
}
