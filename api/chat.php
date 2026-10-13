<?php
session_start();

header("Content-Type: application/json");

$host = "localhost";
$dbname = "folio";
$username = "root";
$password = "";

if (!isset($_SESSION["chatbot_session_id"])) {
  $_SESSION["chatbot_session_id"] = bin2hex(random_bytes(16));
}

$sessionId = $_SESSION["chatbot_session_id"];
$userId = $_SESSION["user_id"] ?? null;

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

$message = trim($data["message"] ?? "");

if ($message === "") {
  echo json_encode([
    "reply" => "Typ eerst een bericht."
  ]);
  exit;
}

if (!function_exists("curl_init")) {
  echo json_encode([
    "reply" => "Arthur fout: cURL staat niet aan in PHP/XAMPP."
  ]);
  exit;
}

$payload = [
  "model" => "llama3.2:3b",
  "messages" => [
    [
      "role" => "system",
      "content" => "Je naam is Arthur. Je bent de vriendelijke chatbot van Folio. Help bezoekers kort en duidelijk met vragen over cv's maken, templates, personal details, accounts en de Folio website. Antwoord standaard in dezelfde taal als de gebruiker."
    ],
    [
      "role" => "user",
      "content" => $message
    ]
  ],
  "stream" => false
];

$ch = curl_init("http://localhost:11434/api/chat");

curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Content-Type: application/json"
  ],
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_TIMEOUT => 60
]);

$response = curl_exec($ch);
$error = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($error) {
  $reply = "Arthur kan Ollama niet bereiken. Controleer of Ollama aanstaat.";
} else {
  $result = json_decode($response, true);

  if ($httpCode < 200 || $httpCode >= 300) {
    $reply = "Arthur kreeg een fout van Ollama.";
  } else {
    $reply = $result["message"]["content"] ?? "Sorry, Arthur kon geen antwoord maken.";
  }
}

try {
  $pdo = new PDO(
    "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
    $username,
    $password,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]
  );

  $statement = $pdo->prepare("
    INSERT INTO chatbot_messages (user_id, session_id, user_message, bot_reply)
    VALUES (:user_id, :session_id, :user_message, :bot_reply)
  ");

  $statement->execute([
    ":user_id" => $userId,
    ":session_id" => $sessionId,
    ":user_message" => $message,
    ":bot_reply" => $reply
  ]);
} catch (PDOException $databaseError) {
  // Arthur blijft werken, ook als opslaan in de database mislukt.
}

echo json_encode([
  "reply" => $reply
]);