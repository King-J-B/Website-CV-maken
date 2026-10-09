<?php
/* ==========================================================================
   Folio — create an account                        POST api/sign-up.php

   Sends:   { firstName, lastName, email, password, terms }
   Answers: 201 { user }  and the user is signed in
            422 { message, fields }  when something is wrong with a field
            409 { message, fields }  when the e-mail already has an account
   ========================================================================== */

require __DIR__ . '/session.php';

require_method('POST');
$data = read_json();

$firstName = text_field($data, 'firstName');
$lastName  = text_field($data, 'lastName');
$email     = strtolower(text_field($data, 'email'));
$password  = is_string($data['password'] ?? null) ? $data['password'] : '';
$terms     = ($data['terms'] ?? false) === true;

// Check everything again here: the browser checks too, but anyone can
// send data to this address without using our form.
$errors = [];

if ($firstName === '') {
    $errors['firstName'] = 'Enter your first name.';
} elseif (mb_strlen($firstName) > 100) {
    $errors['firstName'] = 'Use at most 100 characters.';
}

if ($lastName === '') {
    $errors['lastName'] = 'Enter your last name.';
} elseif (mb_strlen($lastName) > 100) {
    $errors['lastName'] = 'Use at most 100 characters.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
    $errors['email'] = 'Enter an email address like name@example.com.';
}

if (mb_strlen($password) < 12) {
    $errors['password'] = 'Use at least 12 characters.';
} elseif (strlen($password) > 72) {
    // password_hash() only looks at the first 72 bytes.
    $errors['password'] = 'Use at most 72 characters.';
}

if (!$terms) {
    $errors['terms'] = 'Accept the terms to create your account.';
}

if ($errors) {
    send_json(422, ['message' => 'Check the highlighted fields.', 'fields' => $errors]);
}

$taken = [
    'message' => 'There is already an account with this email.',
    'fields'  => ['email' => 'There is already an account with this email. Sign in instead.'],
];

$query = db()->prepare('SELECT id FROM users WHERE email = ?');
$query->execute([$email]);
if ($query->fetch()) {
    send_json(409, $taken);
}

try {
    $query = db()->prepare(
        'INSERT INTO users (first_name, last_name, email, password_hash, terms_accepted_at)
         VALUES (?, ?, ?, ?, NOW())'
    );
    $query->execute([$firstName, $lastName, $email, password_hash($password, PASSWORD_DEFAULT)]);
} catch (PDOException $error) {
    // 23000 = the UNIQUE rule on email: someone signed up with it a moment ago.
    if ($error->getCode() === '23000') {
        send_json(409, $taken);
    }
    throw $error;
}

$userId = (int) db()->lastInsertId();
log_in($userId, false);

send_json(201, ['user' => public_user(current_user())]);
