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

    // Home page (index.html)
    "Gratis cv-maker voor studenten en starters": "Free resume builder for students and starters",
    "Kies een template, vul je gegevens in en zie je cv meteen ontstaan. Gratis, zonder account, en als nette PDF met echte tekst.": "Choose a template, fill in your details and watch your resume take shape. Free, without an account, and as a clean PDF with real text.",
    "Maak je cv": "Create your resume",
    "Bekijk templates": "View templates",
    "Geen account nodig": "No account needed",
    "Gratis PDF-download": "Free PDF download",
    "Leesbaar voor cv-scanners": "Readable by resume scanners",
    "Automatisch opgeslagen": "Saved automatically",
    "Past op 1 A4": "Fits on 1 A4",
    "PDF klaar": "PDF ready",
    "Probeer het hier": "Try it here",
    "Jouw naam": "Your name",
    "Kleur": "Colour",
    "Begin met dit ontwerp": "Start with this design",
    "Je keuzes gaan mee naar de editor.": "Your choices come with you to the editor.",
    "kleuren": "colours",
    "klik naar je PDF": "click to your PDF",
    "accounts nodig": "accounts needed",
    "Zo werkt het": "How it works",
    "Van leeg naar sollicitatieklaar in vier stappen.": "From a blank page to ready to apply in four steps.",
    "Zes ontwerpen, van rustig en klassiek tot kleurrijk. Wisselen kan altijd.": "Six designs, from calm and classic to colourful. You can always switch.",
    "Persoonlijke gegevens, over mij, opleiding, ervaring en vaardigheden. Stap voor stap, met tips.": "Personal details, about me, education, experience and skills. Step by step, with tips.",
    "Maak het van jou": "Make it yours",
    "Kies een kleur, lettertype en ruimte. Je ziet elke wijziging meteen op je A4.": "Pick a colour, font and spacing. You see every change on your A4 right away.",
    "Download je PDF": "Download your PDF",
    "Eén klik. Een nette PDF met echte tekst die recruiters en cv-scanners kunnen lezen.": "One click. A clean PDF with real text that recruiters and resume scanners can read.",
    "Zes ontwerpen. Allemaal gratis.": "Six designs. All free.",
    "Elk template gebruikt dezelfde gegevens, dus je wisselt zonder iets opnieuw te typen.": "Every template uses the same details, so you can switch without typing anything again.",
    "Alle templates bekijken": "View all templates",
    "Kies dit template": "Choose this template",
    "Waarom Folio": "Why Folio",
    "Alles wat je nodig hebt, niets wat je afleidt.": "Everything you need, nothing that distracts you.",
    "Live voorbeeld": "Live preview",
    "Typ links, zie rechts direct je A4-pagina veranderen.": "Type on the left and watch your A4 page change on the right.",
    "Jouw kleur, jouw letter": "Your colour, your font",
    "Zeven kleuren, vier lettertypes en drie soorten ruimte. Op elk template.": "Seven colours, four fonts and three spacing options. On every template.",
    "Eén-pagina-check": "One-page check",
    "Wordt je cv te lang? Een rode lijn laat zien wat eraf valt, met tips om te schrappen.": "Is your resume getting too long? A red line shows what falls off, with tips on what to cut.",
    "PDF met echte tekst": "PDF with real text",
    "Geen plaatje: cv-scanners (ATS) en recruiters kunnen alles lezen en kopiëren.": "Not an image: resume scanners (ATS) and recruiters can read and copy everything.",
    "Begin meteen. Je cv wordt in deze browser bewaard.": "Start right away. Your resume is saved in this browser.",
    "Meerdere cv's": "Several resumes",
    "Een cv per vacature? Maak er zoveel als je wilt in Mijn cv's.": "One resume per job? Make as many as you like in My resumes.",
    "Veelgestelde vragen": "Frequently asked questions",
    "Goed om te weten": "Good to know",
    "Is Folio echt gratis?": "Is Folio really free?",
    "Ja. Je maakt, bewerkt en downloadt je cv's zonder te betalen.": "Yes. You create, edit and download your resumes without paying.",
    "Heb ik een account nodig?": "Do I need an account?",
    "Nee. Je kunt meteen beginnen. Een account om online op te slaan komt later.": "No. You can start right away. An account to save online comes later.",
    "Waar wordt mijn cv bewaard?": "Where is my resume saved?",
    "In je eigen browser, op dit apparaat. Wis je je browsergegevens, dan is je cv ook weg. Download daarom altijd je PDF.": "In your own browser, on this device. If you clear your browser data, your resume is gone too. So always download your PDF.",
    "Kunnen cv-scanners mijn cv lezen?": "Can resume scanners read my resume?",
    "Ja. De PDF bevat echte tekst in een logische volgorde: eerst je naam, dan de rest.": "Yes. The PDF contains real text in a logical order: your name first, then the rest.",
    "Moet mijn cv op één pagina passen?": "Does my resume have to fit on one page?",
    "Voor studenten en starters is één pagina het beste. Folio waarschuwt je als het te lang wordt.": "For students and starters, one page is best. Folio warns you when it gets too long.",
    "Klaar om te starten?": "Ready to start?",
    "Maak vandaag nog je eerste cv met Folio.": "Create your first resume with Folio today.",
    "Inloggen": "Sign in",
    "Een schoolproject van Daan & Jesse, Vista college.": "A school project by Daan & Jesse, Vista College.",
  },

  nl: {
    "My resumes": "Mijn cv's",
    "About us": "Over ons",
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

    // Home page (index.html)
    "Free resume builder for students and starters": "Gratis cv-maker voor studenten en starters",
    "Choose a template, fill in your details and watch your resume take shape. Free, without an account, and as a clean PDF with real text.": "Kies een template, vul je gegevens in en zie je cv meteen ontstaan. Gratis, zonder account, en als nette PDF met echte tekst.",
    "Create your resume": "Maak je cv",
    "View templates": "Bekijk templates",
    "No account needed": "Geen account nodig",
    "Free PDF download": "Gratis PDF-download",
    "Readable by resume scanners": "Leesbaar voor cv-scanners",
    "Saved automatically": "Automatisch opgeslagen",
    "Fits on 1 A4": "Past op 1 A4",
    "PDF ready": "PDF klaar",
    "Try it here": "Probeer het hier",
    "Your name": "Jouw naam",
    "Colour": "Kleur",
    "Start with this design": "Begin met dit ontwerp",
    "Your choices come with you to the editor.": "Je keuzes gaan mee naar de editor.",
    "colours": "kleuren",
    "click to your PDF": "klik naar je PDF",
    "accounts needed": "accounts nodig",
    "How it works": "Zo werkt het",
    "From a blank page to ready to apply in four steps.": "Van leeg naar sollicitatieklaar in vier stappen.",
    "Six designs, from calm and classic to colourful. You can always switch.": "Zes ontwerpen, van rustig en klassiek tot kleurrijk. Wisselen kan altijd.",
    "Personal details, about me, education, experience and skills. Step by step, with tips.": "Persoonlijke gegevens, over mij, opleiding, ervaring en vaardigheden. Stap voor stap, met tips.",
    "Make it yours": "Maak het van jou",
    "Pick a colour, font and spacing. You see every change on your A4 right away.": "Kies een kleur, lettertype en ruimte. Je ziet elke wijziging meteen op je A4.",
    "Download your PDF": "Download je PDF",
    "One click. A clean PDF with real text that recruiters and resume scanners can read.": "Eén klik. Een nette PDF met echte tekst die recruiters en cv-scanners kunnen lezen.",
    "Six designs. All free.": "Zes ontwerpen. Allemaal gratis.",
    "Every template uses the same details, so you can switch without typing anything again.": "Elk template gebruikt dezelfde gegevens, dus je wisselt zonder iets opnieuw te typen.",
    "View all templates": "Alle templates bekijken",
    "Choose this template": "Kies dit template",
    "Why Folio": "Waarom Folio",
    "Everything you need, nothing that distracts you.": "Alles wat je nodig hebt, niets wat je afleidt.",
    "Live preview": "Live voorbeeld",
    "Type on the left and watch your A4 page change on the right.": "Typ links, zie rechts direct je A4-pagina veranderen.",
    "Your colour, your font": "Jouw kleur, jouw letter",
    "Seven colours, four fonts and three spacing options. On every template.": "Zeven kleuren, vier lettertypes en drie soorten ruimte. Op elk template.",
    "One-page check": "Eén-pagina-check",
    "Is your resume getting too long? A red line shows what falls off, with tips on what to cut.": "Wordt je cv te lang? Een rode lijn laat zien wat eraf valt, met tips om te schrappen.",
    "PDF with real text": "PDF met echte tekst",
    "Not an image: resume scanners (ATS) and recruiters can read and copy everything.": "Geen plaatje: cv-scanners (ATS) en recruiters kunnen alles lezen en kopiëren.",
    "Start right away. Your resume is saved in this browser.": "Begin meteen. Je cv wordt in deze browser bewaard.",
    "Several resumes": "Meerdere cv's",
    "One resume per job? Make as many as you like in My resumes.": "Een cv per vacature? Maak er zoveel als je wilt in Mijn cv's.",
    "Frequently asked questions": "Veelgestelde vragen",
    "Good to know": "Goed om te weten",
    "Is Folio really free?": "Is Folio echt gratis?",
    "Yes. You create, edit and download your resumes without paying.": "Ja. Je maakt, bewerkt en downloadt je cv's zonder te betalen.",
    "Do I need an account?": "Heb ik een account nodig?",
    "No. You can start right away. An account to save online comes later.": "Nee. Je kunt meteen beginnen. Een account om online op te slaan komt later.",
    "Where is my resume saved?": "Waar wordt mijn cv bewaard?",
    "In your own browser, on this device. If you clear your browser data, your resume is gone too. So always download your PDF.": "In je eigen browser, op dit apparaat. Wis je je browsergegevens, dan is je cv ook weg. Download daarom altijd je PDF.",
    "Can resume scanners read my resume?": "Kunnen cv-scanners mijn cv lezen?",
    "Yes. The PDF contains real text in a logical order: your name first, then the rest.": "Ja. De PDF bevat echte tekst in een logische volgorde: eerst je naam, dan de rest.",
    "Does my resume have to fit on one page?": "Moet mijn cv op één pagina passen?",
    "For students and starters, one page is best. Folio warns you when it gets too long.": "Voor studenten en starters is één pagina het beste. Folio waarschuwt je als het te lang wordt.",
    "Ready to start?": "Klaar om te starten?",
    "Create your first resume with Folio today.": "Maak vandaag nog je eerste cv met Folio.",
    "Sign in": "Inloggen",
    "A school project by Daan & Jesse, Vista College.": "Een schoolproject van Daan & Jesse, Vista college.",
  },
};

// Text in the HTML can run over several lines; compare it as one line.
function normalise(text) {
  return text.trim().replace(/\s+/g, " ");
}

function translatePage(language) {
  const elements = document.querySelectorAll("h1, h2, h3, p, a, button, span, label, option, li");

  elements.forEach((element) => {
    // Some texts, like the slogan, stay the same in every language.
    if (element.closest("[data-no-translate]")) return;

    // An element that also holds other elements (like a label wrapping an
    // input) must keep them: translate only its own pieces of text. Replacing
    // the whole textContent would delete the input.
    if (element.children.length > 0) {
      element.childNodes.forEach((node) => {
        const ownText = node.nodeType === Node.TEXT_NODE ? normalise(node.nodeValue) : "";
        const translatedOwnText = ownText && translations[language][ownText];

        if (translatedOwnText) {
          // Keep the spaces around the text, replace the words in between.
          node.nodeValue = node.nodeValue.replace(/\S(?:[\s\S]*\S)?/, translatedOwnText);
        }
      });
      return;
    }

    const text = normalise(element.textContent);
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