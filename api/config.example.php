<?php
/* ==========================================================================
   Folio — database login (example)

   Copy this file to config.php (same folder) and fill in your own details.
   config.php is in .gitignore, so passwords never end up on GitHub.

   - XAMPP on your laptop: the values below work as they are.
   - cPanel: use the database, user and password you made under
     "MySQL Databases". cPanel puts your account name in front of both,
     e.g. "account_folio". The host stays "localhost".
   ========================================================================== */

return [
    'host'     => 'localhost',
    'database' => 'folio',
    'username' => 'root',
    'password' => '',

    // E-mail ("Forgot password"). Optional: without these lines Folio sends
    // from no-reply@<the site's domain>.
    // 'mail'      => 'log',   // XAMPP can't send e-mail: write it to a file instead (see api/mail.php)
    // 'mail_from' => 'no-reply@example.com',
];
