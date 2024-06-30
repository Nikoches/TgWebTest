package ru.cynteka.models;

import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@MappedEntity(value ="person",escape = false)
public class User {

    @Id
    @NotBlank
    Long id;

    String userTelegramId;

    Long telegramChatId;

    String email;

    @OneToMany(mappedBy = "telegram_notification.person_id")
    List<TelegramNotification> notificationList;

    public User() {}

    public @NotBlank Long getId() {
        return id;
    }

    public void setId(@NotBlank Long id) {
        this.id = id;
    }

    public String getUserTelegramId() {
        return userTelegramId;
    }

    public void setUserTelegramId(String userTelegramId) {
        this.userTelegramId = userTelegramId;
    }

    public Long getTelegramChatId() {
        return telegramChatId;
    }

    public void setTelegramChatId(Long telegramChatId) {
        this.telegramChatId = telegramChatId;
    }

    public List<TelegramNotification> getNotificationList() {
        return notificationList;
    }

    public void setNotificationList(List<TelegramNotification> notificationList) {
        this.notificationList = notificationList;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
