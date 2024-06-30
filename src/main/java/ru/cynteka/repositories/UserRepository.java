package ru.cynteka.repositories;

import io.micronaut.core.annotation.NonNull;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.PageableRepository;
import jakarta.validation.constraints.NotNull;
import ru.cynteka.models.User;

import java.util.Optional;

@JdbcRepository(dialect = Dialect.POSTGRES)

public interface UserRepository extends PageableRepository<User, Long> {

    @Override
    @NonNull
    Optional<User> findById(@NonNull Long aLong);

    long update(@NonNull @NotNull @Id Long id, @NonNull  Long telegramChatId);

    @NonNull Optional<User> findByUserTelegramId(@NonNull String userTelegramId);

}
