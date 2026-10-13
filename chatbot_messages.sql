-- ==========================================================================
-- Folio — chatbot messages table
-- Import this file into the existing "folio" database.
-- ==========================================================================

CREATE TABLE IF NOT EXISTS chatbot_messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NULL,
  session_id VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  bot_reply TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY chatbot_messages_user_id (user_id),
  KEY chatbot_messages_session_id (session_id),

  CONSTRAINT chatbot_messages_user_fk
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;