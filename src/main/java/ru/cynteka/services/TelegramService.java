package ru.cynteka.services;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.TelegramException;
import com.pengrad.telegrambot.UpdatesListener;
import com.pengrad.telegrambot.model.Message;
import com.pengrad.telegrambot.model.Update;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import io.micronaut.context.annotation.Context;
import io.micronaut.context.annotation.Value;
import io.micronaut.core.annotation.NonNull;
import jakarta.inject.Inject;
import ru.cynteka.models.TelegramNotification;
import ru.cynteka.models.User;

import java.util.List;

@Context
public class TelegramService {

    private final DbService dbService;

    private final TelegramBot bot;

    //    telegramService.sendMessage(871785059L);

    private String webUrl;

    private String token;

    @Inject
    public TelegramService(DbService dbService, @Value("${telegram.token}") String token, @Value("${telegram.weburl}") String webUrl) {
        this.token = token;
        this.webUrl = webUrl;
        this.dbService = dbService;
        this.bot = new TelegramBot(token);
        this.init();
    }

    public void init() {
        bot.setUpdatesListener(this::processUpdates, this::processException);
    }

    public void processProdavayNotification(String code) {
        var optional = this.dbService.findTelegramNotification(code);
        if (optional.isPresent()) {
            var tgNotice = optional.get();
            if (!tgNotice.isAlreadyProcessed() && userChatIsPresent(tgNotice.getPerson())) {
                sendMessage(tgNotice);
            }
        }
    }

    private SendResponse sendMessage(TelegramNotification telegramNotification) {
        var chatId = telegramNotification.getPerson().getTelegramChatId();
        var url = webUrl + "?startapp=" + telegramNotification.getCode();
        return sendMessage(chatId, url);
    }

    private SendResponse sendMessage(Long chatId, String url) {
        return this.bot.execute(new SendMessage(chatId, url));
    }

    private boolean userChatIsPresent(@NonNull User user) {
        return user.getTelegramChatId() != null && user.getUserTelegramId() != null;
    }

    private boolean userIsAlreadyStarted(Update update) {
        com.pengrad.telegrambot.model.User user = update.message().from();
        Long chatID = update.message().chat().id();
        return true;
    }

    private int processUpdates(List<Update> updates) {
        updates.forEach(this::processUpdate);
        return UpdatesListener.CONFIRMED_UPDATES_ALL;
    }

    private void processUpdate(Update update) {
        Message msg = update.message();
        Long chatId = msg.chat().id();
        String username = msg.chat().username();
        var userOptional = this.dbService.findUserByUsername(username);

        if (userOptional.isEmpty()) {
            return;
        }
        var user = userOptional.get();
        if (user.getTelegramChatId() == null && msg.text().equals("/start")) {
            user.setTelegramChatId(chatId);
            this.dbService.updateUserChatId(chatId, user.getId());
            SendResponse response = this.bot.execute(new SendMessage(chatId, "Вы авторизованы на портале Закупай."));
        } else {
            sendMessage(chatId, webUrl);
        }
    }

    private void processException(TelegramException e) {
        if (e.response() != null) {
            // got bad response from telegram
            e.response().errorCode();
            e.response().description();
        } else {
            // probably network error
            e.printStackTrace();
        }
    }

    public String getWebUrl() {
        return webUrl;
    }

    public void setWebUrl(String webUrl) {
        this.webUrl = webUrl;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
