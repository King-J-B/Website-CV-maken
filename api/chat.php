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

/* What Arthur knows about Folio. A small AI model knows nothing about this
   site, so without these facts it makes up buttons and pages. Keep them
   true: when a feature changes, change it here too. */
const FOLIO_FACTS = <<<'FACTS'
Over Folio:
- Folio is een gratis cv-maker voor studenten en starters. Een schoolproject van Daan en Jesse (Vista college).
- Je hebt geen account nodig. Zonder account blijft je cv alleen in je eigen browser, op dat apparaat. Met een gratis account (knop "Inloggen" rechtsboven, daar kun je ook een account aanmaken) staan je cv's online en kun je overal verder.
- Een cv maken: klik op "Maak je cv", kies een template en vul je gegevens in. Rechts zie je meteen een voorbeeld op A4. Alles wordt vanzelf opgeslagen.
- Er zijn 6 templates: Modern, Classic, Minimal, Split, Timeline en Concise. Wisselen kan in de editor boven het voorbeeld ("Template").
- Onderdelen: Persoonlijke gegevens (met foto), Over mij, Opleiding, Werkervaring en Vaardigheden. Met "+ Onderdeel toevoegen" kun je Projecten, Vrijwilligerswerk, Certificaten, Talen en Hobby's toevoegen. De volgorde verander je met "Volgorde aanpassen" (links onder de onderdelen, of bij Ontwerp): verschuif een onderdeel met de pijltjes omhoog en omlaag. Persoonlijke gegevens blijven altijd bovenaan.
- Bij "Ontwerp" boven het voorbeeld kies je kleur, lettertype, ruimte en een ronde of vierkante foto.
- PDF: de blauwe knop "PDF downloaden" staat rechtsboven in de editor (niet bij Ontwerp). Klik erop; het printvenster van je browser opent; kies daar "Opslaan als PDF" en klik op Opslaan. De PDF heeft echte tekst die cv-scanners (ATS) kunnen lezen.
- Delen: klik op "Delen" (in de editor of op een kaartje bij "Mijn cv's"). Zet je persoonlijke link aan; dan kun je de link kopiëren of versturen via e-mail, WhatsApp of LinkedIn. Wie de link heeft, kan je cv bekijken maar niet aanpassen. Link uit = hij werkt niet meer. Hiervoor heb je een account nodig.
- Anoniem: met de schakelaar "Anoniem" boven het voorbeeld verbergt Folio je foto, naam, contactgegevens, jaartallen en hobby's (voor blind solliciteren). Je gegevens blijven bewaard.
- Cv-score: het rondje "Cv-score" boven het voorbeeld geeft je cv een score van 0 tot 100, met tips om het beter te maken.
- "Mijn cv's": al je cv's, met hernoemen (✎), dupliceren (⧉), delen en verwijderen.
- Met een account: bij "Persoonlijke gegevens" vul je je gegevens één keer in (nieuwe cv's beginnen ermee), wijzig je je wachtwoord of verwijder je je account. Wachtwoord vergeten? Gebruik "Wachtwoord vergeten?" op de inlogpagina.
- Rechtsboven wissel je tussen Nederlands en Engels (de vlaggen) en licht of donker (◐).
- Folio kan NIET: sollicitatiebrieven maken, een Word-bestand maken, inloggen met Google of LinkedIn, of teksten voor je schrijven.
FACTS;

// The facts are Dutch; on the English site Arthur must translate them,
// buttons included (the English site says "Download PDF", "Share", ...).
$languageRule = $english
    ? "- Answer ONLY in English, also when the facts below are in Dutch: translate them. Button names on the English site: \"Download PDF\", \"Share\", \"Design\", \"Anonymous\", \"CV score\", \"My resumes\", \"Sign in\", \"+ Add section\", \"Change order\".\n"
    : "- Antwoord in het Nederlands.\n";
$instructions = "Je bent Arthur, de vriendelijke assistent van Folio. Je helpt bezoekers met hun cv en met de Folio-website.\n"
    . "Regels:\n"
    . $languageRule
    . "- Houd het kort: hooguit 4 zinnen, of een korte lijst met stappen.\n"
    . "- Gebruik voor vragen over Folio alleen de feiten hieronder. Verzin geen knoppen, pagina's of functies. Weet je het niet, zeg dat eerlijk.\n"
    . "- Algemene cv-tips (wat zet je in Over mij, hoe beschrijf je werkervaring) mag je wel geven.\n"
    . "- De bezoeker is niet Arthur: spreek hem aan met 'je'. Vraag nooit om privégegevens.\n\n"
    . FOLIO_FACTS
    // Last, because a small model listens best to what comes last.
    . ($english ? "\n\nIMPORTANT: the visitor reads the English site. Write your whole answer in English, never in Dutch." : '');

$settings = config();
$payload = [
    'model'    => $settings['chat_model'] ?? 'llama3.2:3b',
    'messages' => [
        ['role' => 'system', 'content' => $instructions],
        ['role' => 'user', 'content' => $message],
    ],
    'stream'   => false,
    // Less "creative": a small model then sticks closer to the facts.
    'options'  => ['temperature' => 0.3],
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
