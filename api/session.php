<?php
/* ==========================================================================
   Folio — shared helpers for the API files

   Every API file starts with:   require __DIR__ . '/session.php';

   It gives you:
   - db()               the database (from db.php)
   - send_json()        answer the browser and stop
   - require_method()   only allow GET or POST
   - read_json()        the data the browser sent
   - log_in() / log_out() / current_user()

   How "being logged in" works: PHP's session gives each browser a cookie
   with a random code. PHP keeps $_SESSION per code on the server, so after
   sign-in we store the user's id in $_SESSION['user_id'].
   ========================================================================== */

require __DIR__ . '/db.php';

const REMEMBER_DAYS = 30;

// PHP warnings on screen would break the JSON answers (they still go to the log).
ini_set('display_errors', '0');

// Anything that goes wrong unexpectedly (e.g. the database is down) becomes
// a friendly message. The real error goes to the server's error log only.
set_exception_handler(function (Throwable $error) {
    error_log('Folio API: ' . $error->getMessage());
    send_json(500, ['message' => 'Something went wrong on our side. Please try again.']);
});

start_session();

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';

    // Keep session data as long as a "Remember me" cookie can live.
    ini_set('session.gc_maxlifetime', (string) (REMEMBER_DAYS * 86400));

    session_name('folio_session');
    session_set_cookie_params([
        'lifetime' => 0,         // until the browser closes (sign-in can change this)
        'path'     => '/',
        'secure'   => $https,    // only sent over https on the live site
        'httponly' => true,      // JavaScript can't read it, so it can't be stolen by a script
        'samesite' => 'Lax',     // other websites can't send it along with their requests
    ]);
    session_start();
}

// Sends $data as JSON with an HTTP status code, and stops the script.
function send_json(int $status, array $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data);
    exit;
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        header('Allow: ' . $method);
        send_json(405, ['message' => 'Use ' . $method . ' for this address.']);
    }
}

// The browser sends form data as JSON. Requiring the JSON content type also
// blocks other websites: a normal HTML form elsewhere can't send JSON here.
function read_json(): array
{
    $type = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($type, 'application/json') !== 0) {
        send_json(415, ['message' => 'Send the data as JSON.']);
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        send_json(400, ['message' => 'The data could not be read. Please try again.']);
    }
    return $data;
}

// A text field from read_json(), trimmed, or '' when it is missing.
function text_field(array $data, string $name): string
{
    return is_string($data[$name] ?? null) ? trim($data[$name]) : '';
}

// What the browser may know about a user: never the password hash.
function public_user(array $user): array
{
    return [
        'id'        => (int) $user['id'],
        'firstName' => $user['first_name'],
        'lastName'  => $user['last_name'],
        'email'     => $user['email'],
    ];
}

function log_in(int $userId, bool $remember): void
{
    // A new random code after signing in, so an old code can't be reused.
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;

    // "Remember me": send the cookie again, now kept for 30 days instead of
    // until the browser closes.
    if ($remember) {
        $params = session_get_cookie_params();
        setcookie(session_name(), session_id(), [
            'expires'  => time() + REMEMBER_DAYS * 86400,
            'path'     => $params['path'],
            'secure'   => $params['secure'],
            'httponly' => $params['httponly'],
            'samesite' => $params['samesite'],
        ]);
    }

    $query = db()->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?');
    $query->execute([$userId]);
}

function log_out(): void
{
    $_SESSION = [];
    $params = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires'  => time() - 3600,
        'path'     => $params['path'],
        'secure'   => $params['secure'],
        'httponly' => $params['httponly'],
        'samesite' => $params['samesite'],
    ]);
    session_destroy();
}

// The signed-in user's row from the database, or null for guests.
function current_user(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $query = db()->prepare('SELECT * FROM users WHERE id = ?');
    $query->execute([$_SESSION['user_id']]);
    $user = $query->fetch();

    return $user ?: null;
}
