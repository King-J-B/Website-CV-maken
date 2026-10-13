const chatbotHtml = `
  <div class="chatbot">
    <button class="chatbot-toggle" id="chatbotToggle" type="button">
      <img src="images/arthur.png" alt="Arthur" />
      <span>Arthur</span>
    </button>

    <div class="chatbot-panel hidden" id="chatbotPanel">
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <img class="chatbot-avatar" src="images/arthur.png" alt="Arthur" />

          <div>
            <strong>Arthur</strong>
            <span>Vraag iets over je cv</span>
          </div>
        </div>

        <button id="chatbotClose" type="button">×</button>
      </div>

      <div class="chatbot-messages" id="chatbotMessages">
        <div class="chat-message bot">
          Hoi! Ik ben Arthur, de Folio assistent. Waar kan ik je mee helpen?
        </div>
      </div>

      <form class="chatbot-form" id="chatbotForm">
        <input id="chatbotInput" type="text" placeholder="Typ je vraag..." autocomplete="off" />
        <button type="submit">Stuur</button>
      </form>
    </div>
  </div>
`;

document.body.insertAdjacentHTML("beforeend", chatbotHtml);

const chatbotToggle = document.querySelector("#chatbotToggle");
const chatbotPanel = document.querySelector("#chatbotPanel");
const chatbotClose = document.querySelector("#chatbotClose");
const chatbotForm = document.querySelector("#chatbotForm");
const chatbotInput = document.querySelector("#chatbotInput");
const chatbotMessages = document.querySelector("#chatbotMessages");

const chatbotEndpoint = "api/chat.php";

function addChatMessage(text, type) {
  const message = document.createElement("div");
  message.className = `chat-message ${type}`;
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeThinkingMessage() {
  const lastMessage = chatbotMessages.lastElementChild;

  if (lastMessage && lastMessage.textContent === "Arthur denkt even na...") {
    lastMessage.remove();
  }
}

chatbotToggle.addEventListener("click", () => {
  chatbotPanel.classList.toggle("hidden");
});

chatbotClose.addEventListener("click", () => {
  chatbotPanel.classList.add("hidden");
});

chatbotForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = chatbotInput.value.trim();

  if (!question) {
    return;
  }

  addChatMessage(question, "user");
  chatbotInput.value = "";

  addChatMessage("Arthur denkt even na...", "bot");

  try {
    const response = await fetch(chatbotEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: question
      })
    });

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      removeThinkingMessage();
      addChatMessage("Arthur kreeg geen geldig antwoord van de server.", "bot");
      return;
    }

    removeThinkingMessage();

    if (!response.ok) {
      addChatMessage(data.reply || "Arthur kreeg een serverfout.", "bot");
      return;
    }

    addChatMessage(data.reply || "Arthur kon geen antwoord maken.", "bot");
  } catch (error) {
    removeThinkingMessage();
    addChatMessage("Arthur kan nu geen verbinding maken met de server.", "bot");
  }
});