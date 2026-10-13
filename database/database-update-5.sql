-- ==========================================================================
-- Folio — database update 5: Arthur, the chatbot (made by Jesse)
--
-- Only for a database made before this file existed (the live database).
-- A new database made with the current database.sql already has it.
--
-- How to use: phpMyAdmin → click the database → Import → this file.
-- Running it twice is safe: a table that already exists is skipped.
-- ==========================================================================

-- What people ask Arthur and what he answers (api/chat.php). Wiped after
-- 30 days. user_id is empty for guests; deleting an account empties it too.
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED NULL,
  session_id   VARCHAR(100) NOT NULL,  -- one code per browser session (one conversation)
  user_message TEXT         NOT NULL,
  bot_reply    TEXT         NOT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY chatbot_messages_user_id (user_id),
  KEY chatbot_messages_session_id (session_id),
  KEY chatbot_messages_created_at (created_at),  -- for wiping old messages
  CONSTRAINT chatbot_messages_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
