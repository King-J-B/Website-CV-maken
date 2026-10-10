/* ==========================================================================
   Folio — Dutch / English on every page

   The flag buttons switch the language; the choice is remembered. Texts are
   matched exactly (spaces don't matter), so add new texts to the lists below.
   ========================================================================== */

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

/* --------------------------------------------------------------------------
   More texts, written as [Dutch, English] pairs. Each pair is added to both
   lists above, so it works in both directions: the editor, the template page
   and the sign-in pages are written in English, the other pages in Dutch.
   -------------------------------------------------------------------------- */

const pairs = [
  // Shared
  ["Mijn cv's", "My resumes"],
  ["Menu", "Menu"],
  ["Hoofdnavigatie", "Main navigation"],
  ["Taal kiezen", "Choose language"],
  ["Nederlands", "Dutch"],
  ["Donkere modus wisselen", "Toggle dark mode"],
  ["Account menu openen", "Open account menu"],
  ["Persoonlijke gegevens", "Personal details"],
  ["Overzicht", "Overview"],
  ["Begin hier", "Start here"],
  ["Je gegevens", "Your details"],
  ["Voorbeeld", "Preview"],
  ["Zoek op naam of template", "Search by name or template"],
  ["Gebruiker", "User"],
  ["Annuleren", "Cancel"],
  ["Doorgaan", "Continue"],
  ["Optioneel", "Optional"],
  ["Klaar", "Done"],
  ["Terug naar inloggen", "Back to sign in"],
  ["Folio – Mijn cv's", "Folio – My resumes"],
  ["Folio home", "Folio home"],

  // Page titles (the parts between " · ")
  ["Cv bewerken", "Edit CV"],
  ["Kies een template", "Choose a template"],
  ["Wachtwoord vergeten?", "Forgot your password?"],
  ["Check je inbox", "Check your inbox"],
  ["Gratis cv-maker", "Free CV builder"],

  // Editor: top bar and layout
  ["Naar de editor", "Skip to editor"],
  ["Nog niets om op te slaan", "Nothing to save yet"],
  ["Als je je browsergegevens wist, is het weg.", "Clearing your browser data removes it."],
  ["Opnieuw proberen", "Retry"],
  ["PDF downloaden", "Download PDF"],
  ["Onderdeel", "Section"],
  ["Weergave", "View"],
  ["Bewerken", "Edit"],
  ["Onderdelen van je cv", "CV sections"],
  ["Onderdelen", "Sections"],
  ["Je cv past niet op één A4-pagina", "Your CV doesn’t fit on one A4 page"],
  ["Alles onder de rode lijn valt van de pagina. Maak een beschrijving korter, haal een oudere ervaring weg of noem minder vaardigheden. Compacte ruimte onder Ontwerp scheelt ook plek.", "Everything below the red line falls off the page. Shorten a description, remove an older entry or list fewer skills. Compact spacing under Design also saves room."],
  ["Opslaan…", "Saving…"],
  ["Concept opgeslagen op dit apparaat", "Draft saved on this device"],
  ["Je concept kon niet worden opgeslagen. Je wijzigingen staan er nog.", "Couldn't save your draft. Your changes are still here."],
  ["Binnenkort", "Soon"],
  ["Ingevuld", "Filled in"],
  ["Volgende:", "Next:"],
  ["Volgende in de flow: eigen onderdelen zoals hobby's (nog niet gebouwd).", "Next in the flow: custom sections like hobbies (not built yet)."],
  ["Dit onderdeel is nog niet gebouwd", "This section isn't built yet"],
  ["Het staat op de planning. Je kunt naar elk ander onderdeel gaan en later terugkomen.", "It's on the planning. You can still jump to any other section and come back later."],
  ["Vorige en volgende onderdeel", "Previous and next section"],

  // Editor: personal details
  ["Dit komt bovenaan je cv. Alleen je naam is nodig; vul de contactgegevens in die werkgevers mogen gebruiken.", "This goes at the top of your CV. Only your name is needed; add the contact details you want employers to use."],
  ["Volledige naam", "Full name"],
  ["Bijvoorbeeld: Alex Morgan", "For example: Alex Morgan"],
  ["Bijvoorbeeld: Junior UX-designer", "For example: Junior UX designer"],
  ["naam@voorbeeld.nl", "name@example.com"],
  ["Bijvoorbeeld: Breda", "For example: Breda"],
  ["Website of portfolio", "Website or portfolio"],
  ["linkedin.com/in/jouw-naam", "linkedin.com/in/your-name"],
  ["jouwnaam.nl", "yourname.com"],
  ["Past niet op één pagina", "Doesn’t fit on one page"],
  ["(optioneel)", "(optional)"],
  ["E-mail", "Email"],
  ["Telefoon", "Phone"],
  ["Woonplaats", "City"],
  ["Functietitel", "Job title"],
  ["Vul je volledige naam in. Die komt bovenaan je cv.", "Enter your full name. It goes at the top of your CV."],
  ["Vul een e-mailadres in zoals naam@voorbeeld.nl.", "Enter an email address like name@example.com."],
  ["Vul een telefoonnummer in met alleen cijfers, bijvoorbeeld +31 6 12345678.", "Enter a phone number with digits only, for example +31 6 12345678."],
  ["Vul je LinkedIn-link in, bijvoorbeeld linkedin.com/in/jouw-naam.", "Enter your LinkedIn link, for example linkedin.com/in/your-name."],
  ["Vul een webadres in, bijvoorbeeld jouwnaam.nl.", "Enter a web address, for example yourname.com."],

  // Editor: about me
  ["Over mij", "About me"],
  ["Een korte introductie die direct onder je naam staat. Vertel wie je bent, waar je goed in bent en wat je zoekt.", "A short introduction that goes right under your name. Say who you are, what you are good at and what you are looking for."],
  ["Je introductie", "Your introduction"],
  ["2 tot 4 zinnen werkt het best. Recruiters lezen dit deel vaak als eerste.", "2 to 4 sentences works best. Recruiters often read this part first."],
  ["Bijvoorbeeld: Creatieve UX-designstudent die rommelige problemen omzet in simpele schermen. Ik heb gebruikerstests gedaan met echte klanten en een design system gebouwd in Figma. Ik zoek een afstudeerstage in een productteam.", "For example: Creative UX design student who loves turning messy problems into simple screens. I have run usability tests with real customers and built a design system in Figma. I am looking for a graduation internship in a product team."],
  ["Tips", "Tips"],
  ["Begin met wie je bent: \"UX-designstudent\", \"Junior developer\".", "Start with who you are: \"UX design student\", \"Junior developer\"."],
  ["Noem een of twee sterke punten, het liefst met bewijs.", "Name one or two strengths, with proof if you can."],
  ["Sluit af met wat je zoekt.", "End with what you are looking for."],
  ["Recruiters scannen: 2 tot 4 zinnen werkt het best.", "Recruiters skim: 2 to 4 sentences works best."],

  // Editor: education and experience
  ["Opleiding", "Education"],
  ["Voeg je opleidingen toe, de nieuwste eerst. Alleen de opleiding en de school zijn nodig; de rest is optioneel.", "Add your studies, newest first. Only the study and the school are needed; everything else is optional."],
  ["Nog geen opleiding. Voeg eerst je huidige of laatste opleiding toe.", "No education yet. Add your current or most recent study first."],
  ["Opleiding toevoegen", "Add education"],
  ["Werkervaring", "Experience"],
  ["Voeg banen, stages, bijbaantjes of vrijwilligerswerk toe, de nieuwste eerst. Alleen de functie en het bedrijf zijn nodig.", "Add jobs, internships, side jobs or volunteer work, newest first. Only the job title and the company are needed."],
  ["Nog geen werkervaring. Stages en bijbaantjes tellen ook mee.", "No experience yet. Internships and side jobs count too."],
  ["Werkervaring toevoegen", "Add experience"],
  ["Periode", "Dates"],
  ["Startmaand", "Start month"],
  ["Maand", "Month"],
  ["Startjaar", "Start year"],
  ["Jaar", "Year"],
  ["Eindmaand", "End month"],
  ["Eindjaar", "End year"],
  ["De einddatum kan niet voor de startdatum liggen.", "The end date can't be before the start date."],
  ["Start", "Start"],
  ["Einde", "End"],
  ["Nieuwe opleiding", "New education"],
  ["Ik studeer hier nog", "I still study here"],
  ["Deze opleiding verwijderen?", "Remove this education?"],
  ["Opleiding of diploma", "Study or degree"],
  ["Vul je opleiding of diploma in, bijvoorbeeld Bachelor Communicatie.", "Enter your study or degree, for example Bachelor Communication."],
  ["Bijvoorbeeld: Bachelor Communicatie en Multimedia Design", "For example: Bachelor Communication and Multimedia Design"],
  ["School", "School"],
  ["Vul de naam van de school in.", "Enter the name of the school."],
  ["Bijvoorbeeld: Avans Hogeschool", "For example: Avans University"],
  ["Beschrijving", "Description"],
  ["Relevante vakken, projecten of resultaten", "Relevant courses, projects or results"],
  ["Nieuwe baan", "New job"],
  ["Ik werk hier nog", "I currently work here"],
  ["Deze baan verwijderen?", "Remove this job?"],
  ["Vul je functie in, bijvoorbeeld Junior designer.", "Enter your job title, for example Junior designer."],
  ["Bedrijf of organisatie", "Company or organisation"],
  ["Vul het bedrijf of de organisatie in.", "Enter the company or organisation."],
  ["Bijvoorbeeld: Studio Kite", "For example: Studio Kite"],
  ["Bijvoorbeeld: Eindhoven", "For example: Eindhoven"],
  ["Wat je deed", "What you did"],
  ["Eén taak of resultaat per regel. Elke regel wordt een opsommingsteken.", "One task or result per line. Each line becomes a bullet point."],
  ["Nieuwe checkout-flow ontworpen\nGebruikerstests gedaan met 12 klanten", "Designed the new checkout flow\nRan usability tests with 12 customers"],
  ["heden", "Present"],
  ["jan", "Jan"], ["feb", "Feb"], ["mrt", "Mar"], ["apr", "Apr"], ["mei", "May"], ["jun", "Jun"],
  ["jul", "Jul"], ["aug", "Aug"], ["sep", "Sep"], ["okt", "Oct"], ["nov", "Nov"], ["dec", "Dec"],

  // Editor: skills
  ["Vaardigheden", "Skills"],
  ["Voeg de tools en sterke punten toe die werkgevers moeten zien. Vijf tot tien vaardigheden is genoeg.", "Add the tools and strengths you want employers to notice. Five to ten skills is plenty."],
  ["Vaardigheid", "Skill"],
  ["Bijvoorbeeld: Figma", "For example: Figma"],
  ["Niveau", "Level"],
  ["Geen niveau", "No level"],
  ["Vaardigheid toevoegen", "Add skill"],
  ["Je vaardigheden", "Your skills"],
  ["Nog geen vaardigheden. Je eerste vaardigheid verschijnt hier en in het voorbeeld.", "No skills yet. Your first skill appears here and in the preview."],
  ["Vul een vaardigheid in, bijvoorbeeld Figma of Samenwerken.", "Enter a skill, for example Figma or Teamwork."],
  ["Beginner", "Beginner"],
  ["Gemiddeld", "Intermediate"],
  ["Gevorderd", "Advanced"],
  ["Expert", "Expert"],

  // Editor: template and design
  ["Template", "Template"],
  ["Ontwerp", "Design"],
  ["Templates bekijken", "Browse templates"],
  ["Lettertype", "Font"],
  ["Ruimte", "Spacing"],
  ["Terug naar het ontwerp van de template", "Reset to the template's design"],
  ["Kleur van de template", "Template colour"],
  ["Teal", "Teal"],
  ["Groen", "Green"],
  ["Paars", "Purple"],
  ["Bes", "Berry"],
  ["Oranje", "Orange"],
  ["Antraciet", "Charcoal"],
  ["Lettertype van de template", "Template font"],
  ["Inter (modern)", "Inter (modern)"],
  ["Georgia (schreef)", "Georgia (serif)"],
  ["Arial (eenvoudig)", "Arial (simple)"],
  ["Compact", "Compact"],
  ["Normaal", "Normal"],
  ["Ruim", "Roomy"],

  // Editor: CV preview
  ["Je naam", "Your name"],
  ["Hier komt een korte introductie over jou.", "A short introduction about you will appear here."],
  ["Hier komt je opleiding.", "Your education will appear here."],
  ["Hier komt je werkervaring.", "Your experience will appear here."],
  ["Hier komen je vaardigheden.", "Your skills will appear here."],

  // Editor: PDF
  ["Vul eerst je naam in", "Add your name first"],
  ["Je naam staat bovenaan je cv. Vul hem in bij Persoonlijke gegevens en download daarna je PDF.", "Your name goes at the top of your CV. Fill it in under Personal details, then download your PDF."],
  ["Naar Persoonlijke gegevens", "Go to Personal details"],
  ["Het printvenster van je browser gaat zo open. Kies “Opslaan als PDF” als bestemming en klik op Opslaan. Je kunt daar ook een printer kiezen.", "Your browser's print window opens next. Choose “Save as PDF” as the destination and click Save. You can also pick a printer there."],
  ["Je cv als PDF downloaden", "Download your CV as PDF"],

  // Template page
  ["Naar de templates", "Skip to templates"],
  ["Elke template gebruikt dezelfde inhoud, dus je kunt in de editor altijd wisselen zonder iets opnieuw te typen. Een cv past op één A4-pagina.", "Every template uses the same content, so you can switch any time in the editor without retyping anything. A CV fits on one A4 page."],
  ["Huidige", "Current"],
  ["Geschikt voor:", "Best for:"],
  ["Stijl", "Style"],
  ["Je keuze kon niet in deze browser worden opgeslagen. Probeer het opnieuw.", "We couldn't save your choice in this browser. Please try again."],
  ["Een blauwe band bovenaan, duidelijke onderdelen en vaardigheden als labels.", "A blue band on top, clear sections and skills as chips."],
  ["Tech, design en starters", "Tech, design and starters"],
  ["Strak", "Clean"],
  ["Schreeflettertype, een gecentreerde kop en dunne lijnen. Geen kleur.", "Serif type, a centred header and thin rules. No colour."],
  ["Recht, financiën en overheid", "Law, finance and government"],
  ["Formeel", "Formal"],
  ["Schreef", "Serif"],
  ["Veel witruimte, met de namen van de onderdelen in een linkerkolom.", "Lots of white space, with section names in a left column."],
  ["Iedereen die het simpel wil", "Anyone who wants it simple"],
  ["Simpel", "Simple"],
  ["Twee kolommen", "Two columns"],
  ["Een gekleurde kop, met je vaardigheden in een getinte kolom links.", "A coloured header, with your skills in a tinted column on the left."],
  ["Marketing, media en creatieve vakken", "Marketing, media and creative fields"],
  ["Je opleidingen en banen op een lijn, met een stip voor elke stap.", "Your studies and jobs on a line with a dot for each step."],
  ["Studenten met stages en bijbaantjes", "Students with internships and side jobs"],
  ["Kleinere tekst en weinig ruimte, zodat er veel op één pagina past.", "Smaller text and tight spacing, so a lot fits on one page."],
  ["Veel ervaring op één pagina", "Lots of experience on one page"],
  ["Vol", "Dense"],

  // Sign in, sign up, forgot password
  ["Naar inloggen", "Skip to sign in"],
  ["Naar registreren", "Skip to sign up"],
  ["Naar het formulier", "Skip to form"],
  ["Kies een template, vul je gegevens in en download binnen een paar minuten een nette cv.", "Pick a template, fill in your details and download a polished CV in minutes."],
  ["Productdesigner · Amsterdam", "Product designer · Amsterdam"],
  ["Senior designer, Northwind", "Senior designer, Northwind"],
  ["Onderzoek", "Research"],
  ["Prototypen", "Prototyping"],
  ["Opgeslagen in je account", "Saved to your account"],
  ["Welkom terug", "Welcome back"],
  ["Log in op je Folio-account.", "Sign in to your Folio workspace."],
  ["Doorgaan met Google", "Continue with Google"],
  ["Doorgaan met LinkedIn", "Continue with LinkedIn"],
  ["of", "or"],
  ["E-mailadres", "Email address"],
  ["Wachtwoord", "Password"],
  ["Wachtwoord vergeten?", "Forgot password?"],
  ["Wachtwoord tonen", "Show password"],
  ["Wachtwoord verbergen", "Hide password"],
  ["Tonen", "Show"],
  ["Verbergen", "Hide"],
  ["Ingelogd blijven", "Keep me signed in"],
  ["Nieuw bij Folio?", "New to Folio?"],
  ["Account maken", "Create an account"],
  ["Zet je volgende stap", "Make your next move"],
  ["Maak je Folio-account om je cv online te bewaren.", "Create your Folio account to save your CV online."],
  ["Voornaam", "First name"],
  ["Achternaam", "Last name"],
  ["Minstens 12 tekens", "At least 12 characters"],
  ["Ik ga akkoord met de", "I agree to the"],
  ["Gebruiksvoorwaarden", "Terms of Service"],
  ["Privacyverklaring", "Privacy Policy"],
  ["en", "and"],
  ["Account aanmaken", "Create account"],
  ["Heb je al een account?", "Already have an account?"],
  ["Jouw ervaring. Jouw", "Your experience. Your"],
  ["volgende hoofdstuk.", "next chapter."],
  ["Stel je wachtwoord opnieuw in en ga verder waar je gebleven was.", "Reset your password and pick up right where you left off."],
  ["Vul het e-mailadres in dat je voor Folio gebruikt, dan sturen we je een link om het opnieuw in te stellen.", "Enter the email you use for Folio and we'll send you a link to reset it."],
  ["Link versturen", "Send reset link"],
  ["Als er een account bestaat voor", "If an account exists for"],
  [", hebben we een link gestuurd om je wachtwoord opnieuw in te stellen.", ", we've sent a link to reset your password."],
  ["De link verloopt na 30 minuten.", "The link expires in 30 minutes."],
  ["Link opnieuw sturen", "Resend link"],
  ["Er ging iets mis. Probeer het opnieuw.", "Something went wrong. Please try again."],
  ["We konden Folio niet bereiken. Controleer je verbinding en probeer het opnieuw.", "We couldn't reach Folio. Check your connection and try again."],
  ["Vink dit vakje aan om verder te gaan.", "Tick this box to continue."],
  ["Dit veld is verplicht.", "This field is required."],
  ["De wachtwoorden zijn niet hetzelfde.", "The passwords don't match."],
  ["Vul een e-mailadres in zoals naam@voorbeeld.nl.", "Enter an email address like name@example.com."],
  ["Gebruik minstens 12 tekens.", "Use at least 12 characters."],
  ["Ga akkoord met de voorwaarden om je account te maken.", "Accept the terms to create your account."],
  ["Bedenk een wachtwoord.", "Create a password."],
  ["Vul je e-mailadres in.", "Enter your email address."],
  ["Vul je voornaam in.", "Enter your first name."],
  ["Vul je achternaam in.", "Enter your last name."],
  ["Vul je wachtwoord nog een keer in.", "Enter your password again."],
  ["Vul je wachtwoord in.", "Enter your password."],

  // My resumes and the home page
  ["Net aangemaakt", "Just created"],
  ["Gisteren bewerkt", "Edited yesterday"],
  ["Cv zoeken en filteren", "Search and filter resumes"],
  ["Kies template", "Choose template"],
  ["Er zijn nog geen cv's opgeslagen. Kies een template om je eerste cv te maken.", "No resumes have been saved yet. Choose a template to create your first resume."],
  ["Folio in cijfers", "Folio in numbers"],
  ["Vorige templates", "Previous templates"],
  ["Volgende templates", "Next templates"],
  ["Templatekleur", "Template colour"],
  ["Kies", "Choose"],
  ["Lichte modus", "Light mode"],
  ["Donkere modus", "Dark mode"],

  // Messages from the server (api/*.php)
  ["Controleer de gemarkeerde velden.", "Check the highlighted fields."],
  ["Gebruik maximaal 100 tekens.", "Use at most 100 characters."],
  ["Gebruik maximaal 72 tekens.", "Use at most 72 characters."],
  ["Er bestaat al een account met dit e-mailadres.", "There is already an account with this email."],
  ["Er bestaat al een account met dit e-mailadres. Log in plaats daarvan in.", "There is already an account with this email. Sign in instead."],
  ["Het e-mailadres of wachtwoord klopt niet.", "The email address or password is incorrect."],
  ["Vul je e-mailadres en wachtwoord in.", "Enter your email address and password."],
  ["Er ging bij ons iets mis. Probeer het opnieuw.", "Something went wrong on our side. Please try again."],
];

/* Texts with a changing part, like a name or a number: [Dutch, English].
   {name} is kept as it is (user input), {#name} is a number and {*name} is
   translated as well. */
const patterns = [
  ["{#n}. {*section} (binnenkort)", "{#n}. {*section} (soon)"],
  ["{#n}. {*section}", "{#n}. {*section}"],
  ["Niveau voor {skill}", "Level for {skill}"],
  ["{item} omhoog", "Move {item} up"],
  ["{item} omlaag", "Move {item} down"],
  ["{item} verwijderen", "Remove {item}"],
  ["Je vaardigheden ({#n})", "Your skills ({#n})"],
  ["Je hebt {skill} al toegevoegd.", "You already added {skill}."],
  ["Je kunt maximaal {#n} vaardigheden toevoegen. Haal er een weg om een nieuwe toe te voegen.", "You can add up to {#n} skills. Remove one to add another."],
  ["“{item}” wordt van je cv verwijderd. Dit kun je niet ongedaan maken.", "“{item}” will be removed from your CV. This can't be undone."],
  ["A4 · {template}-template", "A4 · {template} template"],
  ["Je cv is langer dan één A4-pagina, dus het deel onder de rode lijn kan op een tweede pagina komen. {*rest}", "Your CV is longer than one A4 page, so the part below the red line may go onto a second page. {*rest}"],
  ["Gebruik minstens {#n} tekens.", "Use at least {#n} characters."],
  ["We hebben een nieuwe link gestuurd naar {email}.", "We sent a new link to {email}."],
  ["Accountmenu: {name}", "Account menu: {name}"],
  ["{template} gebruiken", "Use {template}"],
  ["Volgende: {*section}", "Next: {*section}"],
];

// Keys are stored as one line, like the texts they are compared with.
const oneLine = (text) => text.trim().replace(/\s+/g, " ");

pairs.forEach(([dutch, english]) => {
  translations.en[oneLine(dutch)] = english;
  translations.nl[oneLine(english)] = dutch;
});

// The template page says "New CV" where My resumes says "New resume".
translations.nl["New CV"] = "Nieuw cv";

/* --------------------------------------------------------------------------
   The translator. It runs on every page:
   - the chosen language is remembered (localStorage), Dutch by default
   - it translates the whole page, and keeps translating text that scripts
     add later (the editor, My resumes cards, error messages)
   - it never touches what people typed: inputs, anything inside
     [data-no-translate], and the CV content in the preview
   Other scripts can use window.FolioLang.current ("nl" or "en"),
   FolioLang.t(text) and the "folio:languagechange" event.
   -------------------------------------------------------------------------- */

(function () {
  const STORAGE_KEY = "folio:lang";
  const ATTRIBUTES = ["placeholder", "aria-label", "title", "alt"];

  function readLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "nl";
    } catch (error) {
      return "nl";
    }
  }

  let language = readLanguage();

  // Text in the HTML can run over several lines; compare it as one line.
  function normalise(text) {
    return text.trim().replace(/\s+/g, " ");
  }

  // "Move {item} up" → a regular expression plus the names of its parts.
  function compile(source, target) {
    const names = [];
    // split() keeps the captured parts: text, kind, name, text, kind, name, ...
    const pieces = source.split(/\{([*#]?)(\w+)\}/);
    let escaped = "";
    pieces.forEach((piece, index) => {
      if (index % 3 === 0) {
        escaped += piece.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      } else if (index % 3 === 2) {
        const kind = pieces[index - 1];
        names.push({ name: piece, translate: kind === "*" });
        escaped += kind === "#" ? "(\\d+)" : "(.+?)";
      }
    });
    return { regex: new RegExp(`^${escaped}$`), names, target };
  }

  const compiled = {
    en: patterns.map(([dutch, english]) => compile(dutch, english)),
    nl: patterns.map(([dutch, english]) => compile(english, dutch)),
  };

  // The translation of one text, or null when there is none.
  function translateText(text, lang = language) {
    const key = normalise(text);
    if (!key) return null;

    const direct = translations[lang][key];
    if (direct !== undefined) return direct;

    for (const pattern of compiled[lang]) {
      const match = key.match(pattern.regex);
      if (!match) continue;
      let result = pattern.target;
      pattern.names.forEach((part, index) => {
        const value = match[index + 1];
        const translated = part.translate ? translateText(value, lang) || value : value;
        result = result.replace(new RegExp(`\\{[*#]?${part.name}\\}`), () => translated);
      });
      return result;
    }
    return null;
  }

  // People's own words are never translated. (A text box's placeholder is
  // ours, its content is theirs: content is only checked for text nodes.)
  function isProtected(element, isAttribute) {
    if (!element) return true;
    if (element.closest("[data-no-translate], script, style")) return true;
    if (!isAttribute && element.closest("textarea")) return true;

    // In a CV, only the headings and the grey placeholder texts are ours.
    const cvPage = element.closest(".cv-page");
    if (cvPage) {
      if (!cvPage.hasAttribute("data-cv-page")) return true;
      if (!element.closest(".cv-page__heading, .cv-page__empty, .cv-page__overflow-label, .is-placeholder")) return true;
    }
    return false;
  }

  function translateTextNode(node) {
    if (isProtected(node.parentElement)) return;
    const translated = translateText(node.nodeValue);
    if (translated && translated !== normalise(node.nodeValue)) {
      // Keep the spaces around the text, replace the words in between.
      node.nodeValue = node.nodeValue.replace(/\S(?:[\s\S]*\S)?/, translated);
    }
  }

  function translateAttribute(element, name) {
    const value = element.getAttribute(name);
    if (!value || isProtected(element, true)) return;
    const translated = translateText(value);
    if (translated && translated !== value) element.setAttribute(name, translated);
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;

    ATTRIBUTES.forEach((name) => translateAttribute(root, name));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else ATTRIBUTES.forEach((name) => translateAttribute(node, name));
      node = walker.nextNode();
    }
  }

  // "Personal details · Edit CV · Folio": translate each part.
  function translateTitle() {
    const parts = document.title.split(" · ");
    const translated = parts.map((part) => translateText(part) || part).join(" · ");
    if (translated !== document.title) document.title = translated;
  }

  function updateButtons() {
    document.querySelectorAll("#dutchButton, [data-lang='nl']").forEach((button) => {
      button.classList.toggle("active", language === "nl");
      button.setAttribute("aria-pressed", String(language === "nl"));
    });
    document.querySelectorAll("#englishButton, [data-lang='en']").forEach((button) => {
      button.classList.toggle("active", language === "en");
      button.setAttribute("aria-pressed", String(language === "en"));
    });
  }

  function translatePage() {
    document.documentElement.lang = language;
    translateTree(document.body);
    translateTitle();
    updateButtons();
  }

  function setLanguage(next) {
    if (next !== "nl" && next !== "en") return;
    language = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // Private mode: the choice lasts until the page closes.
    }
    translatePage();
    document.dispatchEvent(new CustomEvent("folio:languagechange", { detail: { language } }));
  }

  window.FolioLang = {
    get current() {
      return language;
    },
    t(text) {
      return translateText(text) || text;
    },
    set: setLanguage,
  };

  document.querySelectorAll("#dutchButton, [data-lang='nl']").forEach((button) => {
    button.addEventListener("click", () => setLanguage("nl"));
  });
  document.querySelectorAll("#englishButton, [data-lang='en']").forEach((button) => {
    button.addEventListener("click", () => setLanguage("en"));
  });

  // Translate whatever scripts add or change later.
  new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "childList") record.addedNodes.forEach(translateTree);
      else if (record.type === "characterData") translateTextNode(record.target);
      else translateAttribute(record.target, record.attributeName);
    });
  }).observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRIBUTES,
  });

  const titleElement = document.querySelector("title");
  if (titleElement) {
    new MutationObserver(translateTitle).observe(titleElement, { childList: true, characterData: true, subtree: true });
  }

  translatePage();
})();
