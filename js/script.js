// CVs are saved by js/cv-store.js (shared with the editor and the template
// page): in the account when signed in, otherwise in this browser.

// The "+" card is an action, not a CV: it is never saved, searched or sorted,
// and always stays at the end of the list.
const actionCards = [
  {
    id: "new",
    title: "Nieuw cv",
    template: "Kies een template",
    updated: "Begin vanaf nul",
    type: "new",
  },
];

// Filled by loadResumeList(), from the account or this browser.
const resumes = [];

const resumeView = document.querySelector("#resumeView");
const emptyView = document.querySelector("#emptyView");
const pageLabel = document.querySelector("#pageLabel");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const pageCard = document.querySelector(".page-card");
const pageTitle = document.querySelector(".page-heading h1");
const pageIntro = document.querySelector(".intro");
const showEmptyButton = document.querySelector("#showEmptyButton");
const toastMessage = document.querySelector("#toastMessage");

// js/translate.js knows the chosen language (it loads before this file).
function pageIsEnglish() {
  return window.FolioLang ? FolioLang.current === "en" : false;
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

  // A CV's title is the user's own text: never translated.
  const title = isExisting ? escapeHtml(resume.title) : getText(resume.title, translateResumeText(resume.title));
  const titleAttribute = isExisting ? " data-no-translate" : "";
  const template = getText(resume.template, translateResumeText(resume.template));
  const updated = formatUpdated(resume);

  const actionButtons = isExisting
    ? `
      <a class="primary-button" href="editor.html?cv=${encodeURIComponent(resume.id)}">${buttonText}</a>
      <button class="delete-button" type="button" data-delete-id="${resume.id}">
        ${getText("Verwijder", "Delete")}
      </button>
    `
    : `
      <button class="primary-button" type="button" data-start-card="${resume.type}">
        ${buttonText}
      </button>
    `;

  // A CV shows the top of its real A4 page (filled in by fillPreviews);
  // the "+" card keeps its plus sign.
  const preview = isExisting
    ? `<div class="resume-preview resume-preview--cv" data-cv-preview="${escapeHtml(resume.id)}" aria-hidden="true"></div>`
    : `<div class="resume-preview"></div>`;

  return `
    <article class="resume-card ${cardClass}" ${startAttribute}>
      ${preview}

      <div>
        <div class="resume-title-row">
          <h3${titleAttribute}>${title}</h3>
          ${isExisting ? `<button class="rename-button" type="button" data-rename-id="${resume.id}" aria-label="${getText("Hernoemen", "Rename")}" title="${getText("Hernoemen", "Rename")}">✎</button>` : ""}
        </div>
        <p class="resume-meta">${template}</p>
        <p class="resume-updated">${updated}</p>
      </div>

      <div class="card-actions">
        ${actionButtons}
      </div>
    </article>
  `;
}

// "Vandaag bewerkt", "Gisteren bewerkt" or "Bewerkt op 6 okt", from the last
// edit. The example CV has no edit time yet and keeps its fixed text.
function formatUpdated(resume) {
  if (!resume.updatedAt) {
    return getText(resume.updated, translateResumeText(resume.updated));
  }

  const edited = new Date(resume.updatedAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (edited.toDateString() === today.toDateString()) {
    return getText("Vandaag bewerkt", "Edited today");
  }
  if (edited.toDateString() === yesterday.toDateString()) {
    return getText("Gisteren bewerkt", "Edited yesterday");
  }

  const date = edited.toLocaleDateString(pageIsEnglish() ? "en-GB" : "nl-NL", { day: "numeric", month: "short" });
  return getText(`Bewerkt op ${date}`, `Edited ${date}`);
}

function translateResumeText(text) {
  const translations = {
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

  pageLabel.textContent = getText("Overzicht", "Overview");
  pageTitle.textContent = getText("Mijn cv's", "My resumes");
  pageIntro.textContent = getText(
    "Bewaar, bewerk en exporteer je cv's vanaf een overzichtelijke plek.",
    "Save, edit and export your resumes from one clear place."
  );
  if (showEmptyButton) showEmptyButton.textContent = getText("Toon empty state", "Show empty state");
}

function showEmpty() {
  pageCard.classList.add("is-empty");
  resumeView.classList.add("hidden");
  emptyView.classList.remove("hidden");

  pageLabel.textContent = getText("Begin hier", "Start here");
  pageTitle.textContent = getText("Nog geen cv's", "No resumes yet");
  pageIntro.textContent = getText(
    "Er zijn nog geen cv's opgeslagen. Kies een template om je eerste cv te maken.",
    "No resumes have been saved yet. Choose a template to create your first resume."
  );
  if (showEmptyButton) showEmptyButton.textContent = getText("Terug naar mijn cv's", "Back to my resumes");
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
    fillPreviews();
  }

  showResumes();
}

// Draw each CV in its card with its own template and design (js/cv-render.js),
// scaled to the card's width.
const previewObserver = "ResizeObserver" in window
  ? new ResizeObserver((entries) => entries.forEach((entry) => FolioRender.fit(entry.target)))
  : null;

function fillPreviews() {
  resumeView.querySelectorAll("[data-cv-preview]").forEach((box) => {
    FolioStore.load(box.dataset.cvPreview).then((content) => {
      box.appendChild(FolioRender.page(content));
      FolioRender.fit(box);
      if (previewObserver) previewObserver.observe(box);
    }, () => {
      // No preview is fine: the card itself still works.
    });
  });
}

function loadResumeList() {
  return FolioStore.list().then((list) => {
    resumes.splice(0, resumes.length, ...list);
    renderResumes();

    // CVs made as a guest moved into the account after signing in.
    const moved = FolioStore.movedCount();
    if (moved) {
      showToast(getText(
        moved === 1 ? "Je cv uit deze browser staat nu in je account" : `${moved} cv's uit deze browser staan nu in je account`,
        moved === 1 ? "Your resume from this browser is now in your account" : `${moved} resumes from this browser are now in your account`
      ));
    }
  }, () => {
    showToast(getText("Je cv's konden niet worden geladen. Probeer het opnieuw.", "Your resumes could not be loaded. Please try again."));
  });
}

// A new CV starts by choosing a template (flow v4: Choose template → Editor).
// templates.html adds the CV card here and then opens the editor.
function startNewResume() {
  window.location.href = "templates.html";
}

// The title stays as chosen from now on (no more automatic "Name - cv").
async function renameResume(id) {
  const resume = resumes.find((item) => item.id === id);
  if (!resume) {
    return;
  }

  const title = await folioConfirm({
    title: getText("Cv hernoemen", "Rename resume"),
    input: { label: getText("Naam van je cv", "Resume name"), value: resume.title, maxLength: 80 },
    confirmLabel: getText("Opslaan", "Save"),
    cancelLabel: getText("Annuleren", "Cancel"),
    tone: "primary",
  });

  if (!title || title === resume.title) {
    return;
  }

  try {
    await FolioStore.rename(id, title);
  } catch (error) {
    showToast(getText("Opslaan is niet gelukt", "Could not save"));
    return;
  }

  resume.title = title;
  resume.titleAuto = false;
  showToast(getText("Naam gewijzigd", "Name changed"));
  renderResumes();
}

async function deleteResume(id) {
  const resume = resumes.find((item) => item.id === id);
  if (!resume) {
    return;
  }

  const name = resume.title;
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

  try {
    await FolioStore.remove(id);
  } catch (error) {
    showToast(getText("Verwijderen is niet gelukt. Probeer het opnieuw.", "Could not delete. Please try again."));
    return;
  }

  const resumeIndex = resumes.findIndex((item) => item.id === id);
  if (resumeIndex !== -1) {
    resumes.splice(resumeIndex, 1);
  }
  showToast(getText("Cv verwijderd", "Resume deleted"));
  renderResumes();
}

// "Bekijk voorbeelddata" (guests): bring the example CV back.
function restoreExample() {
  searchInput.value = "";
  FolioStore.restoreExample().then(loadResumeList);
}

// The demo buttons are only on the page while testing.
showEmptyButton?.addEventListener("click", () => {
  const isEmptyVisible = !emptyView.classList.contains("hidden");

  if (isEmptyVisible) {
    renderResumes();
  } else {
    showEmpty();
  }
});

resumeView.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-id]");
  const renameButton = event.target.closest("[data-rename-id]");
  const startButton = event.target.closest("[data-start-card]");
  const clearSearchButton = event.target.closest("[data-clear-search]");

  if (clearSearchButton) {
    searchInput.value = "";
    renderResumes();
    searchInput.focus();
    return;
  }

  if (renameButton) {
    renameResume(Number(renameButton.dataset.renameId));
    return;
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.deleteId);
    deleteResume(id);
    return;
  }

  if (startButton) {
    startNewResume();
  }
});

document.querySelector("#addResumeButton").addEventListener("click", startNewResume);
document.querySelector("#emptyCreateButton").addEventListener("click", startNewResume);
document.querySelector("#backToResumesButton").addEventListener("click", restoreExample);
// Cards, dates and messages are built in the chosen language: rebuild them on a switch.
document.addEventListener("folio:languagechange", renderResumes);

searchInput.addEventListener("input", renderResumes);
sortSelect.addEventListener("change", renderResumes);

// The example CV is only for guests; an account starts empty.
FolioStore.mode().then((where) => {
  document.querySelector("#backToResumesButton").hidden = where === "account";
});

loadResumeList();