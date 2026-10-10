<?php
/* ==========================================================================
   Folio — sending e-mail

   send_mail($to, $subject, $text) sends a plain-text e-mail with PHP's
   mail(). On cPanel that goes through the server's own mail program.

   XAMPP on a laptop has no mail program. With 'mail' => 'log' in
   config.php the e-mail is written to folio-mail.log in the system's temp
   folder instead (never inside the website, where anyone could read it).
   ========================================================================== */

function send_mail(string $to, string $subject, string $text): bool
{
    $config = config();
    $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
    $host = preg_replace('/^www\./', '', $host);
    $from = $config['mail_from'] ?? 'no-reply@' . $host;

    if (($config['mail'] ?? 'send') === 'log') {
        $entry = "----- " . date('Y-m-d H:i:s') . "\nTo: $to\nFrom: Folio <$from>\nSubject: $subject\n\n$text\n\n";
        return file_put_contents(sys_get_temp_dir() . '/folio-mail.log', $entry, FILE_APPEND) !== false;
    }

    $headers = [
        'From: Folio <' . $from . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];

    // =?UTF-8?...?= so letters like "é" survive in the subject line.
    return mail($to, mb_encode_mimeheader($subject, 'UTF-8'), $text, implode("\r\n", $headers), '-f' . $from);
}
