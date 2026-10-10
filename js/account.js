/* ==========================================================================
   Folio — the account menu in the top bar (My resumes, Templates, Personal details)

   Opens and closes the menu, and asks api/me.php who is signed in, then:
   - signed in: shows their initials, name and e-mail; "Uitloggen" really
     signs out (api/sign-out.php) and goes back to the home page
   - guest: shows an "Inloggen" button instead of the account menu
   - no server (e.g. python http.server): leaves the menu as it is

   Other scripts can wait for the user with:
     window.FolioAccount.ready.then(function (user) { ... });   // user or null
   ========================================================================== */

(function () {
  "use strict";

  var menu = document.querySelector(".account-menu");
  var button = document.querySelector("#accountButton");
  var dropdown = document.querySelector("#accountDropdown");

  function isEnglish() {
    return Boolean(window.FolioLang && window.FolioLang.current === "en");
  }

  // Open and close the menu: the avatar toggles it, a click elsewhere closes it.
  function wireDropdown() {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      dropdown.classList.toggle("hidden");
    });
    dropdown.addEventListener("click", function () {
      dropdown.classList.add("hidden");
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".account-menu")) dropdown.classList.add("hidden");
    });
  }

  // "Daan" + "van den Hombergh" → "DH": first letter of the first name and of
  // the last word of the last name.
  function initials(user) {
    var lastWords = user.lastName.trim().split(/\s+/);
    var first = user.firstName.trim().charAt(0);
    var last = lastWords[lastWords.length - 1].charAt(0);
    return (first + last).toUpperCase() || "?";
  }

  function showUser(user) {
    var fullName = user.firstName + " " + user.lastName;

    button.textContent = initials(user);
    button.setAttribute("aria-label", "Account menu: " + fullName);
    button.title = fullName;

    // Name and e-mail at the top of the menu. Names are never translated.
    var header = document.createElement("div");
    header.className = "account-dropdown-header";
    header.setAttribute("data-no-translate", "");

    var name = document.createElement("strong");
    name.textContent = fullName;
    var email = document.createElement("span");
    email.textContent = user.email;

    header.appendChild(name);
    header.appendChild(email);
    dropdown.insertBefore(header, dropdown.firstChild);

    var signOut = dropdown.querySelector("[data-sign-out]");
    if (signOut) {
      signOut.addEventListener("click", function (event) {
        event.preventDefault();
        fetch("api/sign-out.php", { method: "POST", credentials: "same-origin" })
          .catch(function () {
            // Even if this fails, leave the page: the next page asks the server again.
          })
          .then(function () {
            window.location.assign("index.html");
          });
      });
    }
  }

  function showGuest() {
    var login = document.createElement("a");
    login.className = "primary-button link-button login-button";
    login.href = "sign-in.html";
    login.textContent = isEnglish() ? "Sign in" : "Inloggen";
    menu.replaceWith(login);
  }

  var ready = fetch("api/me.php", { credentials: "same-origin", headers: { Accept: "application/json" } })
    .then(function (response) {
      if (!response.ok) throw new Error("No account server");
      return response.json();
    })
    .then(function (body) {
      return body.user || null;
    });

  window.FolioAccount = {
    // Resolves with the user, or null for guests. Rejects when there is no server.
    ready: ready
  };

  if (!menu || !button || !dropdown) return;
  wireDropdown();

  ready.then(
    function (user) {
      if (user) showUser(user);
      else showGuest();
    },
    function () {
      // No PHP (local Python server): keep the menu so the page still works.
      button.textContent = "?";
    }
  );
})();
