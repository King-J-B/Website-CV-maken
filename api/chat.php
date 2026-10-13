<?php
/* ==========================================================================
   Folio — Arthur, the chatbot (made by Jesse; js/chatbot.js)

   POST api/chat.php  { message, language: "nl" | "en" } → { reply }

   Arthur's answers come from Ollama: an AI program that runs on a computer
   (http://localhost:11434). Another address or model can be set in
   config.php ('chat_url', 'chat_model', see config.example.php).

   Every question and answer is saved in chatbot_messages (with the user's
   id when signed in) and wiped after 30 days, as the privacy statement says.
   ========================================================================== */

require __DIR__ . '/session.php';

const CHAT_MAX_LENGTH = 1000; // the same limit as js/chatbot.js
const CHAT_KEEP_DAYS = 30;

require_method('POST');
$data = read_json();

$message = text_field($data, 'message');
$english = ($data['language'] ?? '') === 'en';

// Arthur's fixed sentences, in the language of the page.
function say(bool $english, string $dutch, string $englishText): string
{
    return $english ? $englishText : $dutch;
}

if ($message === '') {
    send_json(422, ['message' => 'Type a question first.']);
}
if (mb_strlen($message) > CHAT_MAX_LENGTH) {
    send_json(422, ['message' => 'Your question is too long. Keep it under 1000 characters.']);
}

// A random code per browser session, so one conversation can be followed.
if (empty($_SESSION['chatbot_session_id'])) {
    $_SESSION['chatbot_session_id'] = bin2hex(random_bytes(16));
}
$user = current_user();

$settings = config();
$payload = [
    'model'    => $settings['chat_model'] ?? 'llama3.2:3b',
    'messages' => [
        [
            'role'    => 'system',
            'content' => 'Je naam is Arthur. Je bent de vriendelijke chatbot van Folio. Help bezoekers kort en duidelijk met vragen over cv\'s maken, templates, personal details, accounts en de Folio website. Antwoord standaard in dezelfde taal als de gebruiker.',
        ],
        ['role' => 'user', 'content' => $message],
    ],
    'stream'   => false,
];

$reply = null;
if (!function_exists('curl_init')) {
    error_log('Folio chat: cURL is not enabled in PHP.');
} else {
    $ch = curl_init($settings['chat_url'] ?? 'http://localhost:11434/api/chat');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => 60,
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($response === false || $status < 200 || $status >= 300) {
        error_log('Folio chat: Ollama did not answer (' . ($response === false ? curl_error($ch) : 'HTTP ' . $status) . ').');
    } else {
        $result = json_decode($response, true);
        $content = $result['message']['content'] ?? '';
        $reply = is_string($content) && trim($content) !== '' ? trim($content) : null;
    }
    curl_close($ch);
}

// No AI available (for example on the web host, where Ollama doesn't run):
// say so kindly and don't save anything.
if ($reply === null) {
    send_json(200, [
        'reply'       => say($english,
            'Arthur is er nu even niet. Probeer het later opnieuw.',
            "Arthur isn't available right now. Please try again later."),
        'unavailable' => true,
    ]);
}

// Save the conversation, and wipe what is older than 30 days. If saving
// fails, Arthur still answers.
try {
    $query = db()->prepare(
        'INSERT INTO chatbot_messages (user_id, session_id, user_message, bot_reply) VALUES (?, ?, ?, ?)'
    );
    $query->execute([$user ? (int) $user['id'] : null, $_SESSION['chatbot_session_id'], $message, $reply]);

    db()->exec('DELETE FROM chatbot_messages WHERE created_at < NOW() - INTERVAL ' . CHAT_KEEP_DAYS . ' DAY');
} catch (PDOException $error) {
    error_log('Folio chat: could not save the message: ' . $error->getMessage());
}

send_json(200, ['reply' => $reply]);
