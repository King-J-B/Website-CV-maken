// Real CVs are saved in this browser, so adding and deleting survive a reload.
const RESUMES_KEY = "folio:resumes";

const EXAMPLE_RESUME = {
  id: 1,
  title: "Stage UX Designer",
  template: "Modern template",
  updated: "Vandaag bewerkt",
  updatedAt: 0,
  type: "existing",
};

// The "+" cards are actions, not CVs: they are never saved, searched or sorted,
// and always stay at the end of the list.
const actionCards = [
  {
    id: "new",
    title: "Nieuwe cv starten",
    template: "Kies een template",
    updated: "Begin vanaf nul",
    type: "new",
  },
  {
    id: "template",
    title: "Template bekijken",
    template: "Ontdek ontwerpen",
    updated: "Start met voorbeeld",
    type: "template",
  },
];

function loadResumes() {
  try {
    const stored = JSON.parse(localStorage.getItem(RESUMES_KEY));
    if (Array.isArray(stored)) {
      return stored.filter((resume) => resume && resume.type === "existing");
    }
  } catch (error) {
    // No storage or unreadable data: start with the example CV.
  }
  return [{ ...EXAMPLE_RESUME }];
}

function saveResumes() {
  try {
    localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    return true;
  } catch (error) {
    showToast(getText("Opslaan is niet gelukt", "Could not save"));
    return false;
  }
}

const resumes = loadResumes();

const resumeView = document.querySelector("#resumeView");
const emptyView = document.querySelector("#emptyView");
const pageLabel = document.querySelector("#pageLabel");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const themeButton = document.querySelector("#themeButton");
const logo = document.querySelector(".brand-logo");
const pageCard = document.querySelector(".page-card");
const pageTitle = document.querySelector(".page-heading h1");
const pageIntro = document.querySelector(".intro");
const showEmptyButton = document.querySelector("#showEmptyButton");
const toastMessage = document.querySelector("#toastMessage");
const accountButton = document.querySelector("#accountButton");
const accountDropdown = document.querySelector("#accountDropdown");

function pageIsEnglish() {
  const languageButton = document.querySelector("#languageButton");
  return languageButton && languageButton.textContent.trim() === "NL";
}

function getText(dutchText, englishText) {
  return pageIsEnglish() ? englishText : dutchText;
}

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function showToast(message) {
  toastMessage.textContent = message;
  toastMessage.classList.remove("hidden");

  setTimeout(() => {
    toastMessage.classList.add("hidden");
  }, 2200);
}

function createResumeCard(resume) {
  const isExisting = resume.type === "existing";
  const buttonText = isExisting
    ? getText("Verder werken", "Continue editing")
    : getText("Start nieuw", "Start new");

  const cardClass = isExisting ? "" : "is-new-card";
  const startAttribute = isExisting ? "" : `data-start-card="${resume.type}"`;

  const title = getText(resume.title, translateResumeText(resume.title));
  const template = getText(resume.template, translateResumeText(resume.template));
  const updated = getText(resume.updated, translateResumeText(resume.updated));

  const actionButtons = isExisting
    ? `
      <a class="primary-button" href="editor.html">${buttonText}</a>
      <button class="delete-button" type="button" data-delete-id="${resume.id}">
        ${getText("Verwijder", "Delete")}
      </button>
    `
    : `
      <button class="primary-button" type="button" data-start-card="${resume.type}">
        ${buttonText}
      </button>
    `;

  return `
    <article class="resume-card ${cardClass}" ${startAttribute}>
      <div class="resume-preview">
        <div class="preview-line short"></div>
        <div class="preview-line medium"></div>
        <div class="preview-line"></div>
        <div class="preview-line medium"></div>
      </div>

      <div>
        <h3>${title}</h3>
        <p class="resume-meta">${template}</p>
        <p class="resume-updated">${updated}</p>
      </div>

      <div class="card-actions">
        ${actionButtons}
      </div>
    </article>
  `;
}

function translateResumeText(text) {
  const translations = {
    "Stage UX Designer": "UX Designer Internship",
    "Modern template": "Modern template",
    "Vandaag bewerkt": "Edited today",
    "Nieuwe cv starten": "Start new resume",
    "Kies een template": "Choose a template",
    "Begin vanaf nul": "Start from scratch",
    "Template bekijken": "View template",
    "Ontdek ontwerpen": "Explore designs",
    "Start met voorbeeld": "Start with example",
    "Nieuw cv": "New resume",
    "Nog geen template gekozen": "No template selected yet",
    "Net aangemaakt": "Just created",
  };

  return translations[text] || text;
}

function getExistingResumes() {
  return resumes;
}

function showResumes() {
  pageCard.classList.remove("is-empty");
  resumeView.classList.remove("hidden");
  emptyView.classList.add("hidden");

  pageLabel.textContent = getText("Resume page", "Resume page");
  pageTitle.textContent = getText("Mijn cv's", "My resumes");
  pageIntro.textContent = getText(
    "Bewaar, bewerk en exporteer je cv's vanaf een overzichtelijke plek.",
    "Save, edit and export your resumes from one clear place."
  );
  showEmptyButton.textContent = getText("Toon empty state", "Show empty state");
}

function showEmpty() {
  pageCard.classList.add("is-empty");
  resumeView.classList.add("hidden");
  emptyView.classList.remove("hidden");

  pageLabel.textContent = getText("Empty state", "Empty state");
  pageTitle.textContent = getText("Nog geen cv's", "No resumes yet");
  pageIntro.textContent = getText(
    "Er zijn nog geen cv's opgeslagen. Kies een template om je eerste cv te maken.",
    "No resumes have been saved yet. Choose a template to create your first resume."
  );
  showEmptyButton.textContent = getText("Terug naar mijn cv's", "Back to my resumes");
}

function noResultsMessage(searchTerm) {
  return `
    <div class="no-results">
      <p>${getText("Geen cv's gevonden voor", "No resumes found for")} "${escapeHtml(searchTerm)}".</p>
      <button class="secondary-button" type="button" data-clear-search="true">
        ${getText("Zoekopdracht wissen", "Clear search")}
      </button>
    </div>
  `;
}

function renderResumes() {
  // No CVs at all: that is the real empty state.
  if (getExistingResumes().length === 0) {
    resumeView.innerHTML = "";
    showEmpty();
    return;
  }

  const searchTerm = searchInput.value.trim();
  const sortedResumes = [...resumes];

  if (sortSelect.value === "name") {
    sortedResumes.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    sortedResumes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  const filteredResumes = sortedResumes.filter((resume) => {
    return `${resume.title} ${resume.template}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // While searching, show only matching CVs (or a message); otherwise add the "+" cards.
  if (searchTerm && filteredResumes.length === 0) {
    resumeView.innerHTML = noResultsMessage(searchTerm);
  } else {
    const cards = searchTerm ? filteredResumes : [...filteredResumes, ...actionCards];
    resumeView.innerHTML = cards.map(createResumeCard).join("");
  }

  showResumes();
}

// A new CV starts by choosing a template (flow v4: Choose template → Editor).
// templates.html adds the CV card here and then opens the editor.
function startNewResume() {
  window.location.href = "templates.html?new=1";
}

function browseTemplates() {
  window.location.href = "templates.html";
}

async function deleteResume(id) {
  const resume = resumes.find((item) => item.id === id);
  if (!resume) {
    return;
  }

  const name = getText(resume.title, translateResumeText(resume.title));
  const confirmed = await folioConfirm({
    title: getText("Dit cv verwijderen?", "Delete this resume?"),
    message: getText(
      `"${name}" wordt definitief verwijderd. Dit kun je niet ongedaan maken.`,
      `"${name}" will be deleted permanently. This can't be undone.`
    ),
    confirmLabel: getText("Verwijderen", "Delete"),
    cancelLabel: getText("Annuleren", "Cancel"),
  });

  if (!confirmed) {
    return;
  }

  const resumeIndex = resumes.findIndex((item) => item.id === id);

  if (resumeIndex !== -1) {
    resumes.splice(resumeIndex, 1);
    saveResumes();
    showToast(getText("Cv verwijderd", "Resume deleted"));
  }

  renderResumes();
}

async function clearAllResumes() {
  const confirmed = await folioConfirm({
    title: getText("Alle cv's verwijderen?", "Delete all resumes?"),
    message: getText(
      "Demo: al je opgeslagen cv's worden definitief verwijderd. Dit kun je niet ongedaan maken.",
      "Demo: all your saved resumes will be deleted permanently. This can't be undone."
    ),
    confirmLabel: getText("Alles verwijderen", "Delete all"),
    cancelLabel: getText("Annuleren", "Cancel"),
  });

  if (!confirmed) {
    return;
  }

  resumes.splice(0, resumes.length);
  saveResumes();

  searchInput.value = "";
  renderResumes();
  showToast(getText("Alle cv's verwijderd", "All resumes deleted"));
}

// "Bekijk voorbeelddata": bring the example CV back.
function restoreExample() {
  if (!resumes.some((resume) => resume.id === EXAMPLE_RESUME.id)) {
    resumes.push({ ...EXAMPLE_RESUME });
    saveResumes();
  }

  searchInput.value = "";
  renderResumes();
}

function toggleTheme() {
  const isDark = document.body.dataset.theme === "dark";

  if (isDark) {
    document.body.dataset.theme = "light";
    logo.src = "images/folio-logo-light.png";
  } else {
    document.body.dataset.theme = "dark";
    logo.src = "images/folio-logo-dark.png";
  }
}

showEmptyButton.addEventListener("click", () => {
  const isEmptyVisible = !emptyView.classList.contains("hidden");

  if (isEmptyVisible) {
    renderResumes();
  } else {
    showEmpty();
  }
});

resumeView.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-id]");
  const startButton = event.target.closest("[data-start-card]");
  const clearSearchButton = event.target.closest("[data-clear-search]");

  if (clearSearchButton) {
    searchInput.value = "";
    renderResumes();
    searchInput.focus();
    return;
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.deleteId);
    deleteResume(id);
    return;
  }

  if (startButton) {
    if (startButton.dataset.startCard === "template") {
      browseTemplates();
    } else {
      startNewResume();
    }
  }
});

accountButton.addEventListener("click", (event) => {
  event.stopPropagation();
  accountDropdown.classList.toggle("hidden");
});

accountDropdown.addEventListener("click", () => {
  accountDropdown.classList.add("hidden");
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = event.target.closest(".account-menu");

  if (!clickedInsideMenu) {
    accountDropdown.classList.add("hidden");
  }
});

document.querySelector("#addResumeButton").addEventListener("click", startNewResume);
document.querySelector("#emptyCreateButton").addEventListener("click", startNewResume);
document.querySelector("#backToResumesButton").addEventListener("click", restoreExample);
document.querySelector("#clearDemoButton").addEventListener("click", clearAllResumes);
themeButton.addEventListener("click", toggleTheme);

searchInput.addEventListener("input", renderResumes);
sortSelect.addEventListener("change", renderResumes);

renderResumes();