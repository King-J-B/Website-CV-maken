-- ==========================================================================
-- Folio — database update 4: personal links to a CV (sharing)
--
-- Only for a database made before this file existed (the live database).
-- A new database made with the current database.sql already has it.
--
-- How to use: phpMyAdmin → click the database → Import → this file.
-- Import it once: a second time gives "Duplicate column name", which is
-- harmless (the columns are already there).
-- ==========================================================================

ALTER TABLE cvs
  -- The secret code in the personal link (cv.php?c=...). NULL = the link is off.
  ADD COLUMN share_token CHAR(32) NULL AFTER content,
  ADD COLUMN shared_at   DATETIME NULL AFTER share_token,  -- when the link was switched on
  ADD UNIQUE KEY cvs_share_token (share_token);
