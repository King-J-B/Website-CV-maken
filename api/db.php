<?php
/* ==========================================================================
   Folio — database connection

   Other PHP files do:   require __DIR__ . '/db.php';
                         $pdo = db();

   PDO is PHP's built-in way to talk to MySQL. Always use prepared
   statements with ? placeholders, never paste user input into SQL:

     $query = db()->prepare('SELECT * FROM users WHERE email = ?');
     $query->execute([$email]);
   ========================================================================== */

// The settings from config.php (database login, e-mail settings).
function config(): array
{
    static $config = null;
    if ($config === null) {
        $configFile = __DIR__ . '/config.php';
        if (!file_exists($configFile)) {
            throw new RuntimeException('api/config.php is missing. Copy config.example.php to config.php.');
        }
        $config = require $configFile;
    }
    return $config;
}

function db(): PDO
{
    // One connection per request: made the first time, reused after that.
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $config = config();

    $pdo = new PDO(
        'mysql:host=' . $config['host'] . ';dbname=' . $config['database'] . ';charset=utf8mb4',
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // errors stop the script
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // rows as ['name' => ...]
            PDO::ATTR_EMULATE_PREPARES   => false,                  // real prepared statements
        ]
    );

    return $pdo;
}
