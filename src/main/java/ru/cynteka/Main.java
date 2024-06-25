package ru.cynteka;

import com.pengrad.telegrambot.TelegramBot;
import ru.cynteka.BotUtil.BotUtils;
import ru.cynteka.Services.DbService;

public class Main {

    public static void main(String[] args) throws ClassNotFoundException {
        Class.forName("org.postgresql.Driver");
        TelegramBot bot = new TelegramBot("7431332829:AAHLliU6T_VvWyqfgt4KcXEA35TMnqXv-ao");
        BotUtils botUtils = new BotUtils(bot, new DbService());
        botUtils.init();
    }

}

