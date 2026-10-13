-- ==========================================================================
-- Folio — database update 3: "Forgot password" links
--
-- Only for a database made before this file existed (the live database).
-- A new database made with the current database.sql already has it.
--
-- How to use: phpMyAdmin → click the database → Import → this file.
-- ==========================================================================

-- "Forgot password" links. Only a hash of the code in the link is kept, so
-- someone who can read the database still can't use a link.
CREATE TABLE IF NOT EXISTS password_resets (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  token_hash CHAR(64)     NOT NULL,  -- sha256 of the code in the e-mail
  expires_at DATETIME     NOT NULL,  -- 30 minutes after it was asked for
  used_at    DATETIME     NULL,      -- a link works once
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY password_resets_token (token_hash),
  KEY password_resets_user (user_id),
  CONSTRAINT password_resets_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
