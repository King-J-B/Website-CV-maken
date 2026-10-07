const resumes = [
  {
    id: 1,
    title: "Stage UX Designer",
    template: "Modern template",
    updated: "Vandaag bewerkt",
    type: "existing",
  },
  {
    id: 2,
    title: "Nieuwe cv starten",
    template: "Kies een template",
    updated: "Begin vanaf nul",
    type: "new",
  },
  {
    id: 3,
    title: "Template bekijken",
    template: "Ontdek ontwerpen",
    updated: "Start met voorbeeld",
    type: "template",
  },
];

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

function showToast(message) {
  toastMessage.textContent = message;
  toastMessage.classList.remove("hidden");

  setTimeout(() => {
    toastMessage.classList.add("hidden");
  }, 2200);
}

function createResumeCard(resume) {
  const isExisting = resume.type === "existing";
  const buttonText = isExisting ? "Verder werken" : "Start nieuw";
  const cardClass = isExisting ? "" : "is-new-card";

  const actionButtons = isExisting
    ? `
      <a class="primary-button" href="editor.html">Verder werken</a>
      <button class="delete-button" type="button" data-delete-id="${resume.id}">
        Verwijder
      </button>
    `
    : `
      <button class="primary-button" type="button" data-start-card="true">
        ${buttonText}
      </button>
    `;

  return `
    <article class="resume-card ${cardClass}">
      <div class="resume-preview">
        <div class="preview-line short"></div>
        <div class="preview-line medium"></div>
        <div class="preview-line"></div>
        <div class="preview-line medium"></div>
      </div>

      <div>
        <h3>${resume.title}</h3>
        <p class="resume-meta">${resume.template}</p>
        <p class="resume-updated">${resume.updated}</p>
      </div>

      <div class="card-actions">
        ${actionButtons}
      </div>
    </article>
  `;
}

function getExistingResumes() {
  return resumes.filter((resume) => resume.type === "existing");
}

function showResumes() {
  pageCard.classList.remove("is-empty");
  resumeView.classList.remove("hidden");
  emptyView.classList.add("hidden");

  pageLabel.textContent = "Resume page";
  pageTitle.textContent = "Mijn cv's";
  pageIntro.textContent = "Bewaar, bewerk en exporteer je cv's vanaf een overzichtelijke plek.";
  showEmptyButton.textContent = "Toon empty state";
}

function showEmpty() {
  pageCard.classList.add("is-empty");
  resumeView.classList.add("hidden");
  emptyView.classList.remove("hidden");

  pageLabel.textContent = "Empty state";
  pageTitle.textContent = "Nog geen cv's";
  pageIntro.textContent = "Er zijn nog geen cv's opgeslagen. Kies een template om je eerste cv te maken.";
  showEmptyButton.textContent = "Terug naar mijn cv's";
}

function renderResumes() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const sortedResumes = [...resumes];

  if (sortSelect.value === "name") {
    sortedResumes.sort((a, b) => a.title.localeCompare(b.title));
  }

  const filteredResumes = sortedResumes.filter((resume) => {
    return `${resume.title} ${resume.template}`.toLowerCase().includes(searchTerm);
  });

  resumeView.innerHTML = filteredResumes.map(createResumeCard).join("");

  if (filteredResumes.length === 0 || getExistingResumes().length === 0) {
    showEmpty();
    return;
  }

  showResumes();
}

function addResume() {
  resumes.unshift({
    id: Date.now(),
    title: "Nieuw cv",
    template: "Nog geen template gekozen",
    updated: "Net aangemaakt",
    type: "existing",
  });

  searchInput.value = "";
  renderResumes();
  showToast("Cv aangemaakt");
}

function deleteResume(id) {
  const confirmed = confirm("Weet je zeker dat je deze cv wilt verwijderen?");

  if (!confirmed) {
    return;
  }

  const resumeIndex = resumes.findIndex((resume) => resume.id === id);

  if (resumeIndex !== -1) {
    resumes.splice(resumeIndex, 1);
    showToast("Cv verwijderd");
  }

  renderResumes();
}

function clearAllResumes() {
  const confirmed = confirm("Demo: wil je alle opgeslagen cv's verwijderen?");

  if (!confirmed) {
    return;
  }

  for (let i = resumes.length - 1; i >= 0; i -= 1) {
    if (resumes[i].type === "existing") {
      resumes.splice(i, 1);
    }
  }

  searchInput.value = "";
  showEmpty();
  showToast("Alle cv's verwijderd");
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

  if (deleteButton) {
    const id = Number(deleteButton.dataset.deleteId);
    deleteResume(id);
  }

  if (startButton) {
    addResume();
  }
});

document.querySelector("#addResumeButton").addEventListener("click", addResume);
document.querySelector("#emptyCreateButton").addEventListener("click", addResume);
document.querySelector("#backToResumesButton").addEventListener("click", renderResumes);
document.querySelector("#clearDemoButton").addEventListener("click", clearAllResumes);
themeButton.addEventListener("click", toggleTheme);

searchInput.addEventListener("input", renderResumes);
sortSelect.addEventListener("change", renderResumes);

renderResumes();