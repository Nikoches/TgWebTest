package ru.cynteka.services;

import io.micronaut.context.annotation.Context;
import ru.cynteka.models.TelegramNotification;
import ru.cynteka.models.User;
import ru.cynteka.repositories.TelegramNotificationRepo;
import ru.cynteka.repositories.UserRepository;

import java.util.Optional;

@Context
public class DbService {

    private final String selectSql = """
            SELECT id, user_telegram_id, telegram_chat_id from person 
            where user_telegram_id is not null;
            """;
    private final String updateSql = """
            Update person set telegram_chat_id = ? where user_telegram_id = ?;
            """;

    private final TelegramNotificationRepo telegramNotificationRepo;

    private final UserRepository userRepository;

    public DbService(TelegramNotificationRepo telegramNotificationRepo, UserRepository userRepository) {
        this.telegramNotificationRepo = telegramNotificationRepo;
        this.userRepository = userRepository;
    }
    public Optional<TelegramNotification> findTelegramNotification(String code) {
        return telegramNotificationRepo.findByCode(code);
    }

    public Optional<User> findUserByUsername(String userName) {
        return this.userRepository.findByUserTelegramId(userName);
    }

    public long updateUserChatId(Long chatId, Long userId) {
        return this.userRepository.update(userId, chatId);
    }

}
