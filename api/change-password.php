<?php
/* ==========================================================================
   Folio — change the password of the signed-in user (Personal details page)

   POST api/change-password.php  { currentPassword, newPassword }
        → 200 { ok: true }            the password is changed
        → 401 { message, fields }     the current password is incorrect
        → 422 { message, fields }     the new password is too short or too long
   ========================================================================== */

require __DIR__ . '/session.php';

$user = require_login();
require_method('POST');
$data = read_json();

$current = is_string($data['currentPassword'] ?? null) ? $data['currentPassword'] : '';
$new = is_string($data['newPassword'] ?? null) ? $data['newPassword'] : '';

// The current password is asked first, so someone at an unlocked computer
// can't take over the account.
if (!password_verify($current, $user['password_hash'])) {
    send_json(401, ['message' => 'The password is incorrect.', 'fields' => ['currentPassword' => 'The password is incorrect.']]);
}

// The same rules as when the account was made (sign-up.php).
if (mb_strlen($new) < 12) {
    send_json(422, ['message' => 'Use at least 12 characters.', 'fields' => ['newPassword' => 'Use at least 12 characters.']]);
}
if (strlen($new) > 72) {
    send_json(422, ['message' => 'Use at most 72 characters.', 'fields' => ['newPassword' => 'Use at most 72 characters.']]);
}

$query = db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
$query->execute([password_hash($new, PASSWORD_DEFAULT), $user['id']]);

// Reset links that were still open stop working: they were for the old password.
$query = db()->prepare('UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL');
$query->execute([$user['id']]);

send_json(200, ['ok' => true]);
