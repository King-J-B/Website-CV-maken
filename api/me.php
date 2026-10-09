<?php
/* ==========================================================================
   Folio — who is signed in?                        GET api/me.php

   Answers: 200 { user }           when signed in
            200 { user: null }     for guests
   ========================================================================== */

require __DIR__ . '/session.php';

require_method('GET');
$user = current_user();

send_json(200, ['user' => $user ? public_user($user) : null]);
