<?php
/* ==========================================================================
   Folio — "Forgot password": send a reset link     POST api/password-reset.php

   Sends:   { email, lang }      lang: "nl" or "en", the language of the e-mail
   Answers: 200 { ok: true }     always, also for unknown addresses, so this
                                 form can't be used to find out who has an account

   The link: reset-password.html?token=<random code>. The database only keeps
   a hash of the code. A link works once, for 30 minutes. At most 3 links per
   account per hour.
   ========================================================================== */

require __DIR__ . '/session.php';
require __DIR__ . '/mail.php';

const RESET_MINUTES = 30;
const RESETS_PER_HOUR = 3;

// Links in the e-mail only ever point to these sites, even if someone sends
// a fake "Host" header to make the link point somewhere else.
const ALLOWED_HOSTS = ['simplyfacturaspain.com', 'www.simplyfacturaspain.com', 'localhost', '127.0.0.1'];

require_method('POST');
$data = read_json();
$email = strtolower(text_field($data, 'email'));
$english = text_field($data, 'lang') === 'en';

$done = ['ok' => true];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(422, ['message' => 'Enter an email address like name@example.com.', 'fields' => ['email' => 'Enter an email address like name@example.com.']]);
}

$query = db()->prepare('SELECT * FROM users WHERE email = ?');
$query->execute([$email]);
$user = $query->fetch();
if (!$user) {
    send_json(200, $done); // same answer as when it worked
}

$query = db()->prepare('SELECT COUNT(*) FROM password_resets WHERE user_id = ? AND created_at > NOW() - INTERVAL 1 HOUR');
$query->execute([$user['id']]);
if ((int) $query->fetchColumn() >= RESETS_PER_HOUR) {
    send_json(200, $done); // enough e-mails for now; no new one
}

// The address of reset-password.html, next to the api/ folder.
$host = $_SERVER['HTTP_HOST'] ?? '';
if (!in_array(preg_replace('/:\d+$/', '', $host), ALLOWED_HOSTS, true)) {
    send_json(400, ['message' => 'Something went wrong. Please try again.']);
}
$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
$folder = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/\\');
$token = bin2hex(random_bytes(32));
$link = ($https ? 'https' : 'http') . '://' . $host . $folder . '/reset-password.html?token=' . $token;

$query = db()->prepare(
    'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, NOW() + INTERVAL ' . RESET_MINUTES . ' MINUTE)'
);
$query->execute([$user['id'], hash('sha256', $token)]);

$name = $user['first_name'];
if ($english) {
    $subject = 'Reset your Folio password';
    $text = "Hi $name,\n\n"
        . "You asked for a new password for Folio. Choose one with this link:\n\n"
        . "$link\n\n"
        . "The link works once, for " . RESET_MINUTES . " minutes. Didn't ask for this? Then ignore this e-mail: your password stays the same.\n\n"
        . "Folio";
} else {
    $subject = 'Je Folio-wachtwoord opnieuw instellen';
    $text = "Hoi $name,\n\n"
        . "Je hebt gevraagd om een nieuw wachtwoord voor Folio. Kies het via deze link:\n\n"
        . "$link\n\n"
        . "De link werkt één keer en " . RESET_MINUTES . " minuten lang. Heb je dit niet gevraagd? Dan kun je deze e-mail negeren: je wachtwoord blijft hetzelfde.\n\n"
        . "Folio";
}

if (!send_mail($user['email'], $subject, $text)) {
    error_log('Folio: could not send the reset e-mail to user ' . $user['id']);
    send_json(500, ['message' => 'We couldn\'t send the e-mail. Please try again later.']);
}

send_json(200, $done);
