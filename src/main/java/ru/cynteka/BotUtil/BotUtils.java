package ru.cynteka.BotUtil;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.TelegramException;
import com.pengrad.telegrambot.UpdatesListener;
import com.pengrad.telegrambot.model.Message;
import com.pengrad.telegrambot.model.Update;
import com.pengrad.telegrambot.model.User;
import com.pengrad.telegrambot.request.GetChat;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.GetChatResponse;
import com.pengrad.telegrambot.response.SendResponse;
import ru.cynteka.Services.DbService;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BotUtils {

    private final TelegramBot bot;


    private Map<String, ru.cynteka.Models.User> chatUsrMap = new HashMap<>();

    private DbService dbService;

    public BotUtils(TelegramBot bot, DbService dbService) {
        this.bot = bot;
        this.dbService = dbService;
    }

    public void init()  {
        this.chatUsrMap = this.dbService.createUserChatMap();
        bot.setUpdatesListener(this::processUpdates, this::processException);
    }

    private boolean userIsAlreadyStarted(Update update) {
        User user = update.message().from();
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
        var user = chatUsrMap.get(username);

        if (user == null) {
            return;
        }

        if (user.getChatId() == null && msg.text().equals("/start")) {
            user.setChatId(chatId);
            this.dbService.saveUser(user);
            SendResponse response = this.bot.execute(new SendMessage(chatId, "Вы авторизованы на портале Закупай."));
        }
    }

    private GetChatResponse getChatFulInfo(Long id) {
        return bot.execute(new GetChat(id));
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
}
