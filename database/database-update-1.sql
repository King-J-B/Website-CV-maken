-- ==========================================================================
-- Folio — database update 1: separate columns for every user detail
--
-- Only for a database made with the FIRST version of database.sql (where
-- users had one "name" column). A new database made with the current
-- database.sql already has these columns: skip this file.
--
-- How to use: phpMyAdmin → click the database → Import → this file.
-- ==========================================================================

ALTER TABLE users
  CHANGE name first_name VARCHAR(100) NOT NULL,
  ADD last_name         VARCHAR(100) NOT NULL DEFAULT '' AFTER first_name,
  ADD job_title         VARCHAR(150) NULL AFTER password_hash,
  ADD city              VARCHAR(100) NULL AFTER job_title,
  ADD phone             VARCHAR(50)  NULL AFTER city,
  ADD website           VARCHAR(255) NULL AFTER phone,
  ADD terms_accepted_at DATETIME     NULL AFTER website,
  ADD last_login_at     DATETIME     NULL AFTER terms_accepted_at,
  ADD updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- last_name only needed a default to fill rows that already existed.
ALTER TABLE users ALTER last_name DROP DEFAULT;
