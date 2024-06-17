package ru.cynteka.Models;

public class User {
    String userName;
    Long chatId;
    Long prodavayId;


    public User() {
    }

    public User(Long prodavayId, String userName) {
        this.prodavayId = prodavayId;
        this.userName = userName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getProdavayId() {
        return prodavayId;
    }

    public void setProdavayId(Long prodavayId) {
        this.prodavayId = prodavayId;
    }
}
