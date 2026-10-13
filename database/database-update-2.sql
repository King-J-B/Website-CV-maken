-- ==========================================================================
-- Folio — database update 2: automatic CV titles
--
-- Only for a database made before this file existed (the live database).
-- A new database made with the current database.sql already has it.
--
-- How to use: phpMyAdmin → click the database → Import → this file.
-- ==========================================================================

-- 1 = nobody chose the title yet: it follows the name on the CV ("Sam de Vries - cv").
ALTER TABLE cvs
  ADD title_auto TINYINT(1) NOT NULL DEFAULT 1 AFTER title;
