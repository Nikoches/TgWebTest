package ru.cynteka.repositories;

import io.micronaut.core.annotation.NonNull;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.exceptions.DataAccessException;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.PageableRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.cynteka.models.TelegramNotification;

import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface TelegramNotificationRepo extends PageableRepository<TelegramNotification, Long> {

    TelegramNotification save(@NonNull @NotBlank TelegramNotification name);

    @Transactional
    default TelegramNotification saveWithException(@NonNull @NotBlank TelegramNotification notification) {
        save(notification);
        throw new DataAccessException("test exception");
    }

    long update(@NonNull @NotNull @Id Long id, @NonNull @NotBlank String code);

    @Override
    @NonNull Optional<TelegramNotification> findById(@NonNull Long aLong);

    @NonNull Optional<TelegramNotification> findByCode(@NonNull String code);
}
