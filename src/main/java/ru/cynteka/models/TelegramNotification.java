package ru.cynteka.models;

import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.MappedProperty;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import java.util.Date;

@Serdeable
@MappedEntity
public class TelegramNotification {

    @Id
    private Long id;

    private Date date;

//    @ManyToOne
//    private Offer offer;
//
//    @ManyToOne
//    private OrderMain order;
//
    @ManyToOne()
    @JoinColumn(name = "person_id")
    private User person;

    private String code;

    private boolean alreadyProcessed;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }


    public boolean isAlreadyProcessed() {
        return alreadyProcessed;
    }

    public void setAlreadyProcessed(boolean alreadyProcessed) {
        alreadyProcessed = alreadyProcessed;
    }


    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public User getPerson() {
        return person;
    }

    public void setPerson(User person) {
        this.person = person;
    }
}
