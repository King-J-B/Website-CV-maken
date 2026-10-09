<?php
/* ==========================================================================
   Folio — database check

   Open api/check.php in the browser. It says whether PHP can reach the
   database and whether the tables from database.sql exist. It never shows
   passwords or error details, because this page is public.
   ========================================================================== */

require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $tables = db()->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    $missing = array_values(array_diff(['users', 'cvs'], $tables));

    echo json_encode([
        'database' => 'connected',
        'tables'   => $missing ? 'missing: ' . implode(', ', $missing) : 'ok',
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['database' => 'not connected']);
}
