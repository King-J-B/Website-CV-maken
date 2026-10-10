<?php
/* ==========================================================================
   Folio — choose a new password with the link from the e-mail

   GET  api/reset-password.php?token=…    → { valid: true | false }
   POST api/reset-password.php  { token, password }
        → 200 { user }   the password is changed and the user is signed in
        → 410 { message } the link is unknown, used or expired
        → 422 { message, fields } the password is too short or too long
   ========================================================================== */

require __DIR__ . '/session.php';

// The unused, unexpired reset that belongs to this code, or null.
function find_reset(string $token): ?array
{
    if (!preg_match('/^[0-9a-f]{64}$/', $token)) {
        return null;
    }
    $query = db()->prepare(
        'SELECT * FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()'
    );
    $query->execute([hash('sha256', $token)]);
    return $query->fetch() ?: null;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    send_json(200, ['valid' => find_reset((string) ($_GET['token'] ?? '')) !== null]);
}

require_method('POST');
$data = read_json();
$password = is_string($data['password'] ?? null) ? $data['password'] : '';

$reset = find_reset(text_field($data, 'token'));
if (!$reset) {
    send_json(410, ['message' => 'This link has expired or was already used. Ask for a new one.']);
}

// The same rules as when the account was made (sign-up.php).
if (mb_strlen($password) < 12) {
    send_json(422, ['message' => 'Use at least 12 characters.', 'fields' => ['password' => 'Use at least 12 characters.']]);
}
if (strlen($password) > 72) {
    send_json(422, ['message' => 'Use at most 72 characters.', 'fields' => ['password' => 'Use at most 72 characters.']]);
}

$query = db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
$query->execute([password_hash($password, PASSWORD_DEFAULT), $reset['user_id']]);

// This link is used; other links that were still open stop working too.
$query = db()->prepare('UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL');
$query->execute([$reset['user_id']]);

log_in((int) $reset['user_id'], false);

send_json(200, ['user' => public_user(current_user())]);
