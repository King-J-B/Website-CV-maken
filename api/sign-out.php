<?php
/* ==========================================================================
   Folio — sign out                                 POST api/sign-out.php

   Answers: 200 { ok: true }  and the session is gone
   ========================================================================== */

require __DIR__ . '/session.php';

require_method('POST');
log_out();

send_json(200, ['ok' => true]);
