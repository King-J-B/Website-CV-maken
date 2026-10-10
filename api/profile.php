<?php
/* ==========================================================================
   Folio — the signed-in user's personal details (Personal details page)

   GET   api/profile.php   → { profile: {firstName, lastName, email, jobTitle, city, phone, website} }
   POST  api/profile.php   { the same fields } → { profile }

   New CVs start with these details (see api/cvs.php).
   ========================================================================== */

require __DIR__ . '/session.php';

$user = require_login();

function profile(array $user): array
{
    return [
        'firstName' => $user['first_name'],
        'lastName'  => $user['last_name'],
        'email'     => $user['email'],
        'jobTitle'  => $user['job_title'] ?? '',
        'city'      => $user['city'] ?? '',
        'phone'     => $user['phone'] ?? '',
        'website'   => $user['website'] ?? '',
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    send_json(200, ['profile' => profile($user)]);
}

require_method('POST');
$data = read_json();

$fields = [
    'firstName' => text_field($data, 'firstName'),
    'lastName'  => text_field($data, 'lastName'),
    'email'     => strtolower(text_field($data, 'email')),
    'jobTitle'  => text_field($data, 'jobTitle'),
    'city'      => text_field($data, 'city'),
    'phone'     => text_field($data, 'phone'),
    'website'   => text_field($data, 'website'),
];

// The longest text each column can hold (database.sql).
$maxLength = ['firstName' => 100, 'lastName' => 100, 'email' => 255, 'jobTitle' => 150, 'city' => 100, 'phone' => 50, 'website' => 255];

$errors = [];
foreach ($maxLength as $name => $max) {
    if (mb_strlen($fields[$name]) > $max) {
        $errors[$name] = 'Use at most ' . $max . ' characters.';
    }
}
if ($fields['firstName'] === '') {
    $errors['firstName'] = 'Enter your first name.';
}
if ($fields['lastName'] === '') {
    $errors['lastName'] = 'Enter your last name.';
}
if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Enter an email address like name@example.com.';
}
if ($errors) {
    send_json(422, ['message' => 'Check the highlighted fields.', 'fields' => $errors]);
}

// Another account may not have this e-mail address already.
$query = db()->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
$query->execute([$fields['email'], $user['id']]);
if ($query->fetch()) {
    send_json(409, [
        'message' => 'There is already an account with this email.',
        'fields'  => ['email' => 'There is already an account with this email.'],
    ]);
}

// Empty optional fields are stored as NULL ("not filled in").
$optional = function (string $value) {
    return $value === '' ? null : $value;
};

$query = db()->prepare(
    'UPDATE users SET first_name = ?, last_name = ?, email = ?, job_title = ?, city = ?, phone = ?, website = ? WHERE id = ?'
);
$query->execute([
    $fields['firstName'],
    $fields['lastName'],
    $fields['email'],
    $optional($fields['jobTitle']),
    $optional($fields['city']),
    $optional($fields['phone']),
    $optional($fields['website']),
    $user['id'],
]);

send_json(200, ['profile' => profile(current_user())]);
