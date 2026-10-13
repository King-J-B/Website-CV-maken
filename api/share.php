<?php
/* ==========================================================================
   Folio — the personal link to one of your CVs

   GET  api/share.php?id=5                 → { shared, url }
   POST api/share.php?id=5  { shared: true }  → { shared: true,  url }  link on
   POST api/share.php?id=5  { shared: false } → { shared: false, url: null }  link off

   The link is like a key to the CV: anyone with it can view the CV in cv.php,
   nobody can change it. Switching it off wipes the code, so the old link
   never works again; switching it on again makes a new code.
   ========================================================================== */

require __DIR__ . '/session.php';

$user = require_login();
$userId = (int) $user['id'];
$id = (int) ($_GET['id'] ?? 0);

function find_own_cv(int $id, int $userId): array
{
    $query = db()->prepare('SELECT id, share_token FROM cvs WHERE id = ? AND user_id = ?');
    $query->execute([$id, $userId]);
    $row = $query->fetch();
    if (!$row) {
        send_json(404, ['message' => 'This CV does not exist (anymore).']);
    }
    return $row;
}

// "https://simplyfacturaspain.com/studenten/cv.php?c=..." — the folder above api/.
function share_url(string $token): string
{
    $https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    $folder = rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME']))), '/');
    return ($https ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $folder . '/cv.php?c=' . $token;
}

function answer(?string $token): void
{
    send_json(200, ['shared' => $token !== null, 'url' => $token !== null ? share_url($token) : null]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    answer(find_own_cv($id, $userId)['share_token']);
}

require_method('POST');
$row = find_own_cv($id, $userId);
$data = read_json();
if (!is_bool($data['shared'] ?? null)) {
    send_json(422, ['message' => 'Say whether the link should be on or off.']);
}

if (!$data['shared']) {
    $query = db()->prepare('UPDATE cvs SET share_token = NULL, shared_at = NULL, updated_at = updated_at WHERE id = ? AND user_id = ?');
    $query->execute([$id, $userId]);
    answer(null);
}

// Already on: keep the link people may already have.
if ($row['share_token'] !== null) {
    answer($row['share_token']);
}

// 16 random bytes = 32 letters and digits: impossible to guess.
$token = bin2hex(random_bytes(16));
$query = db()->prepare('UPDATE cvs SET share_token = ?, shared_at = NOW(), updated_at = updated_at WHERE id = ? AND user_id = ?');
$query->execute([$token, $id, $userId]);
answer($token);
