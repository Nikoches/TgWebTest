package ru.cynteka.Services;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import ru.cynteka.Models.User;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class DbService {

    private final String selectSql = """
            SELECT id, user_telegram_id, telegram_chat_id from person 
            where user_telegram_id is not null;
            """;
    private final String updateSql = """
            Update person set telegram_chat_id = ? where user_telegram_id = ?;
            """;
    private static HikariDataSource dataSource;

    private static HikariConfig config = new HikariConfig();

    static {
        config.setJdbcUrl("jdbc:postgresql://localhost:5432/cyn_maindb_custom4");
        config.setUsername("equipment");
        config.setPassword("password");
        config.setConnectionTimeout(50000);
        config.setMaximumPoolSize(10);
        dataSource = new HikariDataSource(config);
    }

    public Map<String, User> createUserChatMap() {
        var resultMap = new HashMap<String, User>();

        try (Connection con = dataSource.getConnection()) {
            var set = con.prepareStatement(selectSql).executeQuery();
            while (set.next()) {
                var u = new User();
                u.setProdavayId(getLongOrNull(set,"id"));
                u.setUserName(set.getString("user_telegram_id"));
                u.setChatId(getLongOrNull(set,"telegram_chat_id"));
                resultMap.put(u.getUserName(), u);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return resultMap;
    }

    public boolean saveUser(User user) {
        try (Connection con = dataSource.getConnection()) {
            var statement = con.prepareStatement(updateSql);
            statement.setLong(1, user.getChatId());
            statement.setString(2, user.getUserName());
            return statement.execute();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private Long getLongOrNull(ResultSet set, String propName) {
        try {
            var result = set.getLong(propName);
            if(result == 0L && set.wasNull()) {
                return null;
            }
            return result;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    };
}
