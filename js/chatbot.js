/* ==========================================================================
   Folio — Arthur, the chatbot (made by Jesse)

   A button bottom right opens a small chat window. Questions go to
   api/chat.php, which asks the AI (Ollama) and saves the conversation for
   30 days (see the privacy statement).

   Load it last on a page, after js/translate.js:
     <link rel="stylesheet" href="css/chatbot.css">
     <script src="js/chatbot.js"></script>

   Texts are English here; js/translate.js shows them in the chosen language.
   Arthur's answers and the user's own questions are never translated.
   ========================================================================== */

(function () {
  "use strict";

  var MAX_LENGTH = 1000; // the same limit as api/chat.php
  var ENDPOINT = "api/chat.php";

  function L(text) {
    return window.FolioLang ? window.FolioLang.t(text) : text;
  }

  document.body.insertAdjacentHTML("beforeend",
    '<div class="chatbot">' +
    '  <button class="chatbot-toggle" type="button" aria-expanded="false" aria-controls="chatbotPanel" data-chatbot-toggle>' +
    '    <img src="images/arthur.png" alt="">' +
    "    <span>Arthur</span>" +
    "  </button>" +

    '  <section class="chatbot-panel" id="chatbotPanel" aria-labelledby="chatbotTitle" hidden>' +
    '    <div class="chatbot-header">' +
    '      <div class="chatbot-header-info">' +
    '        <img class="chatbot-avatar" src="images/arthur.png" alt="">' +
    "        <div>" +
    '          <strong id="chatbotTitle">Arthur</strong>' +
    "          <span>Ask anything about your CV</span>" +
    "        </div>" +
    "      </div>" +
    '      <button class="chatbot-close" type="button" aria-label="Close chat" data-chatbot-close>×</button>' +
    "    </div>" +

    // Arthur's answers and the user's questions: never translated.
    '    <div class="chatbot-messages" role="log" aria-live="polite" data-no-translate data-chatbot-messages></div>' +
    '    <p class="chatbot-note">Arthur is an AI and can make mistakes. Don\'t share private details.</p>' +

    '    <form class="chatbot-form" data-chatbot-form>' +
    '      <label class="visually-hidden" for="chatbotInput">Your question</label>' +
    '      <input id="chatbotInput" type="text" placeholder="Type your question…" autocomplete="off" maxlength="' + MAX_LENGTH + '">' +
    '      <button type="submit">Send</button>' +
    "    </form>" +
    "  </section>" +
    "</div>");

  document.body.classList.add("has-chatbot"); // room at the bottom (css/chatbot.css)
  var root = document.querySelector(".chatbot");
  var toggle = root.querySelector("[data-chatbot-toggle]");
  var panel = root.querySelector("#chatbotPanel");
  var messages = root.querySelector("[data-chatbot-messages]");
  var form = root.querySelector("[data-chatbot-form]");
  var input = root.querySelector("#chatbotInput");
  var sendButton = form.querySelector("button");
  var greeted = false;

  function addMessage(text, type) {
    var message = document.createElement("div");
    message.className = "chat-message " + type;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  function open() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    // The greeting in the language of the moment it opens.
    if (!greeted) {
      addMessage(L("Hi! I'm Arthur, the Folio assistant. How can I help you?"), "bot");
      greeted = true;
    }
    input.focus();
  }

  function close() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }

  toggle.addEventListener("click", function () {
    if (panel.hidden) open();
    else close();
  });
  root.querySelector("[data-chatbot-close]").addEventListener("click", close);
  root.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) close();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var question = input.value.trim();
    if (!question || sendButton.disabled) return;

    addMessage(question, "user");
    input.value = "";
    sendButton.disabled = true;
    var thinking = addMessage(L("Arthur is thinking…"), "bot is-thinking");

    fetch(ENDPOINT, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        message: question,
        language: window.FolioLang && window.FolioLang.current === "en" ? "en" : "nl"
      })
    })
      .then(function (response) {
        return response.json().catch(function () {
          return {};
        });
      })
      .then(function (data) {
        // reply: Arthur's answer; message: an error from the server (in English).
        addMessage(data.reply || L(data.message || "Arthur couldn't answer. Please try again."), "bot");
      }, function () {
        addMessage(L("Arthur can't connect to the server right now."), "bot");
      })
      .finally(function () {
        thinking.remove();
        sendButton.disabled = false;
        input.focus();
      });
  });
})();
