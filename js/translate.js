const dutchButton = document.querySelector("#dutchButton");
const englishButton = document.querySelector("#englishButton");

let currentLanguage = "nl";

const translations = {
  en: {
    "Home": "Home",
    "Mijn cv's": "My resumes",
    "Templates": "Templates",
    "About us": "About us",

    "Folio CV Builder": "Folio CV Builder",
    "Put Your": "Put Your",
    "Potential": "Potential",
    "on Paper.": "on Paper.",
    "Folio helpt studenten en starters om stap voor stap een duidelijk, modern en overzichtelijk cv te maken.": "Folio helps students and starters create a clear, modern and organized resume step by step.",
    "Start met je cv": "Start your resume",
    "Over Folio": "About Folio",

    "Over ons": "About us",
    "Gemaakt door twee Software Development studenten.": "Created by two Software Development students.",
    "Folio is gemaakt door Daan van den Hombergh en Jesse Breuers, twee vierdejaars Software Development studenten van het Vista college in Maastricht. Tijdens onze stage in Spanje bouwen wij deze cv-builder als opdracht.": "Folio was created by Daan van den Hombergh and Jesse Breuers, two fourth-year Software Development students from Vista College in Maastricht. During our internship in Spain, we are building this resume builder as an assignment.",
    "Lees meer": "Read more",

    "Kies een template": "Choose a template",
    "Begin met een ontwerp dat past bij je stijl en de functie waarop je solliciteert.": "Start with a design that fits your style and the job you are applying for.",
    "Vul je gegevens in": "Fill in your details",
    "Voeg persoonlijke gegevens, ervaring, opleiding en vaardigheden overzichtelijk toe.": "Add personal details, experience, education and skills in a clear way.",
    "Bekijk live je cv": "Preview your resume live",
    "Zie meteen hoe je cv eruit komt te zien terwijl je aanpassingen maakt.": "Instantly see what your resume looks like while making changes.",

    "Resume page": "Resume page",
    "Bewaar, bewerk en exporteer je cv's vanaf een overzichtelijke plek.": "Save, edit and export your resumes from one clear place.",
    "Demo: verwijder alle cv's": "Demo: remove all resumes",
    "Toon empty state": "Show empty state",
    "Terug naar mijn cv's": "Back to my resumes",
    "Nieuw cv": "New resume",
    "Zoeken": "Search",
    "Sorteer": "Sort",
    "Laatst bewerkt": "Last edited",
    "Naam": "Name",
    "Empty state": "Empty state",
    "Nog geen cv's": "No resumes yet",
    "Begin met een template en bouw stap voor stap je eerste cv. Je kunt later altijd wisselen van ontwerp.": "Start with a template and build your first resume step by step. You can always change the design later.",
    "Bekijk voorbeelddata": "View example data",
    "Stage UX Designer": "UX Designer Internship",
    "Modern template": "Modern template",
    "Vandaag bewerkt": "Edited today",
    "Nieuwe cv starten": "Start new resume",
    "Begin vanaf nul": "Start from scratch",
    "Template bekijken": "View template",
    "Ontdek ontwerpen": "Explore designs",
    "Start met voorbeeld": "Start with example",
    "Verder werken": "Continue editing",
    "Start nieuw": "Start new",
    "Verwijder": "Delete",
    "Mijn account": "My account",
    "Instellingen": "Settings",
    "Uitloggen": "Log out",

    "Wij zijn Daan en Jesse, de makers van Folio.": "We are Daan and Jesse, the makers of Folio.",
    "Wie zijn wij?": "Who are we?",
    "Daan & Jesse": "Daan & Jesse",
    "Onze namen zijn Daan van den Hombergh en Jesse Breuers. Wij zijn vierdejaars studenten Software Development aan het Vista college in Maastricht.": "Our names are Daan van den Hombergh and Jesse Breuers. We are fourth-year Software Development students at Vista College in Maastricht.",
    "We zijn allebei 20 jaar oud en lopen momenteel stage in Spanje. Voor onze opdracht maken wij deze CV website.": "We are both 20 years old and are currently doing an internship in Spain. For our assignment, we are creating this CV website.",
    "Een simpele cv-builder": "A simple resume builder",
    "Met Folio willen we het makkelijker maken om snel een professioneel cv te bouwen. Gebruikers kunnen hun gegevens invullen, een template kiezen en direct zien hoe hun cv eruit komt te zien.": "With Folio, we want to make it easier to quickly create a professional resume. Users can fill in their details, choose a template and instantly see what their resume looks like.",
    "Ons doel is om een overzichtelijke en gebruiksvriendelijke website te maken waarmee studenten en starters sneller een nette cv kunnen maken.": "Our goal is to create a clear and user-friendly website that helps students and starters create a neat resume faster.",
    "Foto": "Photo",

    "Account": "Account",
    "Personal details": "Personal details",
    "Vul je persoonlijke gegevens in. Deze informatie wordt gebruikt voor je cv en je account.": "Fill in your personal details. This information is used for your resume and your account.",
    "Terug": "Back",
    "Opslaan": "Save",
    "Gebruiker": "User",
    "Persoonlijke gegevens": "Personal details",
    "Concept": "Draft",
    "Voornaam": "First name",
    "Achternaam": "Last name",
    "Functietitel": "Job title",
    "Woonplaats": "City",
    "E-mail": "Email",
    "Telefoon": "Phone",
    "LinkedIn / portfolio": "LinkedIn / portfolio",
    "Account preview": "Account preview",
    "Voornaam Achternaam": "First name Last name",
  },

  nl: {
    "My resumes": "Mijn cv's",
    "Folio helps students and starters create a clear, modern and organized resume step by step.": "Folio helpt studenten en starters om stap voor stap een duidelijk, modern en overzichtelijk cv te maken.",
    "Start your resume": "Start met je cv",
    "Created by two Software Development students.": "Gemaakt door twee Software Development studenten.",
    "Folio was created by Daan van den Hombergh and Jesse Breuers, two fourth-year Software Development students from Vista College in Maastricht. During our internship in Spain, we are building this resume builder as an assignment.": "Folio is gemaakt door Daan van den Hombergh en Jesse Breuers, twee vierdejaars Software Development studenten van het Vista college in Maastricht. Tijdens onze stage in Spanje bouwen wij deze cv-builder als opdracht.",
    "Read more": "Lees meer",
    "Choose a template": "Kies een template",
    "Start with a design that fits your style and the job you are applying for.": "Begin met een ontwerp dat past bij je stijl en de functie waarop je solliciteert.",
    "Fill in your details": "Vul je gegevens in",
    "Add personal details, experience, education and skills in a clear way.": "Voeg persoonlijke gegevens, ervaring, opleiding en vaardigheden overzichtelijk toe.",
    "Preview your resume live": "Bekijk live je cv",
    "Instantly see what your resume looks like while making changes.": "Zie meteen hoe je cv eruit komt te zien terwijl je aanpassingen maakt.",

    "Save, edit and export your resumes from one clear place.": "Bewaar, bewerk en exporteer je cv's vanaf een overzichtelijke plek.",
    "Demo: remove all resumes": "Demo: verwijder alle cv's",
    "Show empty state": "Toon empty state",
    "Back to my resumes": "Terug naar mijn cv's",
    "New resume": "Nieuw cv",
    "Search": "Zoeken",
    "Sort": "Sorteer",
    "Last edited": "Laatst bewerkt",
    "Name": "Naam",
    "No resumes yet": "Nog geen cv's",
    "Start with a template and build your first resume step by step. You can always change the design later.": "Begin met een template en bouw stap voor stap je eerste cv. Je kunt later altijd wisselen van ontwerp.",
    "View example data": "Bekijk voorbeelddata",
    "UX Designer Internship": "Stage UX Designer",
    "Modern template": "Modern template",
    "Edited today": "Vandaag bewerkt",
    "Start new resume": "Nieuwe cv starten",
    "Start from scratch": "Begin vanaf nul",
    "View template": "Template bekijken",
    "Explore designs": "Ontdek ontwerpen",
    "Start with example": "Start met voorbeeld",
    "Continue editing": "Verder werken",
    "Start new": "Start nieuw",
    "Delete": "Verwijder",
    "My account": "Mijn account",
    "Settings": "Instellingen",
    "Log out": "Uitloggen",

    "We are Daan and Jesse, the makers of Folio.": "Wij zijn Daan en Jesse, de makers van Folio.",
    "Who are we?": "Wie zijn wij?",
    "Our names are Daan van den Hombergh and Jesse Breuers. We are fourth-year Software Development students at Vista College in Maastricht.": "Onze namen zijn Daan van den Hombergh en Jesse Breuers. Wij zijn vierdejaars studenten Software Development aan het Vista college in Maastricht.",
    "We are both 20 years old and are currently doing an internship in Spain. For our assignment, we are creating this CV website.": "We zijn allebei 20 jaar oud en lopen momenteel stage in Spanje. Voor onze opdracht maken wij deze CV website.",
    "About Folio": "Over Folio",
    "A simple resume builder": "Een simpele cv-builder",
    "With Folio, we want to make it easier to quickly create a professional resume. Users can fill in their details, choose a template and instantly see what their resume looks like.": "Met Folio willen we het makkelijker maken om snel een professioneel cv te bouwen. Gebruikers kunnen hun gegevens invullen, een template kiezen en direct zien hoe hun cv eruit komt te zien.",
    "Our goal is to create a clear and user-friendly website that helps students and starters create a neat resume faster.": "Ons doel is om een overzichtelijke en gebruiksvriendelijke website te maken waarmee studenten en starters sneller een nette cv kunnen maken.",
    "Photo": "Foto",

    "Fill in your personal details. This information is used for your resume and your account.": "Vul je persoonlijke gegevens in. Deze informatie wordt gebruikt voor je cv en je account.",
    "Back": "Terug",
    "Save": "Opslaan",
    "User": "Gebruiker",
    "Draft": "Concept",
    "First name": "Voornaam",
    "Last name": "Achternaam",
    "Job title": "Functietitel",
    "City": "Woonplaats",
    "Email": "E-mail",
    "Phone": "Telefoon",
    "First name Last name": "Voornaam Achternaam",
  },
};

function translatePage(language) {
  const elements = document.querySelectorAll("h1, h2, h3, p, a, button, span, label, option, li");

  elements.forEach((element) => {
    const text = element.textContent.trim();
    const translatedText = translations[language][text];

    if (translatedText) {
      element.textContent = translatedText;
    }
  });

  const searchInput = document.querySelector("#searchInput");

  if (searchInput) {
    searchInput.placeholder = language === "en" ? "Search by name or template" : "Zoek op naam of template";
  }

  dutchButton.classList.toggle("active", language === "nl");
  englishButton.classList.toggle("active", language === "en");
}

dutchButton.addEventListener("click", () => {
  currentLanguage = "nl";
  translatePage("nl");
});

englishButton.addEventListener("click", () => {
  currentLanguage = "en";
  translatePage("en");
});

document.addEventListener("click", () => {
  setTimeout(() => {
    translatePage(currentLanguage);
  }, 50);
});