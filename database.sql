-- ==========================================================================
-- Folio — database tables
--
-- How to use:
--   1. Create an empty database first.
--      - On your laptop (XAMPP): phpMyAdmin → New → name "folio" → Create.
--      - On cPanel: "MySQL Databases" (or "Database Wizard"). cPanel adds
--        your account name in front, e.g. "account_folio".
--   2. Click that database in phpMyAdmin → Import → choose this file → Import.
--
-- Running it twice is safe: tables that already exist are skipped.
-- ==========================================================================

-- Everyone with an account. Every detail has its own column.
CREATE TABLE IF NOT EXISTS users (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name        VARCHAR(100) NOT NULL,
  last_name         VARCHAR(100) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  -- Never the real password: PHP's password_hash() turns it into a
  -- scrambled code that can be checked, but not turned back.
  password_hash     VARCHAR(255) NOT NULL,

  -- Filled in later on the Personal details page (empty until then).
  job_title         VARCHAR(150) NULL,
  city              VARCHAR(100) NULL,
  phone             VARCHAR(50)  NULL,
  website           VARCHAR(255) NULL,

  terms_accepted_at DATETIME     NULL,  -- when they ticked "I agree to the Terms"
  last_login_at     DATETIME     NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  -- One account per e-mail address.
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The CVs, each owned by one user.
CREATE TABLE IF NOT EXISTS cvs (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  title      VARCHAR(150) NOT NULL DEFAULT 'Nieuw cv',
  -- Template id from js/templates-data.js: modern, classic, minimal, ...
  template   VARCHAR(30)  NOT NULL DEFAULT 'modern',
  -- Everything the editor saves (sections, design), stored as JSON text.
  content    JSON         NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY cvs_user_id (user_id),
  -- Deleting a user also deletes their CVs.
  CONSTRAINT cvs_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
