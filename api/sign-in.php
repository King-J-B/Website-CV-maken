<?php
/* ==========================================================================
   Folio — sign in                                  POST api/sign-in.php

   Sends:   { email, password, remember }
   Answers: 200 { user }  and the user is signed in
            401 { message }  when the e-mail or password is wrong
   ========================================================================== */

require __DIR__ . '/session.php';

require_method('POST');
$data = read_json();

$email    = strtolower(text_field($data, 'email'));
$password = is_string($data['password'] ?? null) ? $data['password'] : '';
$remember = ($data['remember'] ?? false) === true;

if ($email === '' || $password === '') {
    send_json(422, ['message' => 'Enter your email address and password.']);
}

$query = db()->prepare('SELECT * FROM users WHERE email = ?');
$query->execute([$email]);
$user = $query->fetch();

// The same message for "no account" and "wrong password", so nobody can
// use this form to find out which e-mail addresses have an account.
if (!$user || !password_verify($password, $user['password_hash'])) {
    send_json(401, ['message' => 'The email address or password is incorrect.']);
}

// When PHP gets a stronger hashing method, update the stored hash.
if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
    $query = db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $query->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
}

log_in((int) $user['id'], $remember);

send_json(200, ['user' => public_user($user)]);
