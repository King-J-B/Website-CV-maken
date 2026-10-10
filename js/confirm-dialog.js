/* ==========================================================================
   Folio — confirmation box (shared by My resumes and the editor)

   Replaces the browser's built-in confirm() pop-up, which some browsers
   (like the Claude desktop browser pane) never show and silently treat as
   "Cancel". This box is part of the page, so it works everywhere.

   Usage:
     folioConfirm({
       title: "Delete this resume?",
       message: "It will be deleted permanently.",
       confirmLabel: "Delete",
       cancelLabel: "Cancel",
       tone: "primary" // optional: blue instead of red confirm button
     }).then(function (confirmed) { ... });

   Resolves true only when the user clicks the confirm button. Escape, the
   Cancel button and a click outside the box all resolve false. The answer
   comes straight from those actions, not from the dialog's "close" event.

   With a text field (for example "Rename"):
     folioConfirm({ title: "...", input: { label: "Name", value: "Old", maxLength: 80 }, tone: "primary" })
   input.type: "password" for a password field (default "text").
       .then(function (text) { ... });   // the trimmed text, or null on Cancel
   ========================================================================== */

(function () {
  "use strict";

  var dialog = null;
  var titleEl = null;
  var messageEl = null;
  var confirmButton = null;
  var cancelButton = null;
  var field = null;
  var fieldLabel = null;
  var fieldInput = null;
  var resolveCurrent = null;
  var withInput = false;

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "folio-confirm";
    dialog.setAttribute("aria-labelledby", "folio-confirm-title");
    dialog.setAttribute("aria-describedby", "folio-confirm-message");
    dialog.innerHTML =
      '<form method="dialog" class="folio-confirm__box">' +
      '  <h2 class="folio-confirm__title" id="folio-confirm-title"></h2>' +
      '  <p class="folio-confirm__message" id="folio-confirm-message"></p>' +
      '  <label class="folio-confirm__field" hidden><span></span><input type="text" autocomplete="off"></label>' +
      '  <div class="folio-confirm__actions">' +
      '    <button class="folio-confirm__button folio-confirm__button--cancel" value="cancel" type="submit"></button>' +
      '    <button class="folio-confirm__button folio-confirm__button--danger" value="confirm" type="submit"></button>' +
      "  </div>" +
      "</form>";
    document.body.appendChild(dialog);

    titleEl = dialog.querySelector(".folio-confirm__title");
    messageEl = dialog.querySelector(".folio-confirm__message");
    cancelButton = dialog.querySelector('[value="cancel"]');
    confirmButton = dialog.querySelector('[value="confirm"]');
    field = dialog.querySelector(".folio-confirm__field");
    fieldLabel = field.querySelector("span");
    fieldInput = field.querySelector("input");

    // Enter in the text field confirms (an empty field is not accepted).
    fieldInput.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      event.preventDefault();
      settle(true);
    });

    // Answer straight from the button, Escape or outside click. Chrome only
    // fires the dialog's "close" event with the next screen update, which a
    // hidden or background tab may not do for a long time, so the answer must
    // not depend on it.
    confirmButton.addEventListener("click", function (event) {
      event.preventDefault();
      settle(true);
    });

    cancelButton.addEventListener("click", function (event) {
      event.preventDefault();
      settle(false);
    });

    dialog.addEventListener("cancel", function (event) {
      event.preventDefault(); // Escape
      settle(false);
    });

    // A click on the dimmed area outside the box counts as Cancel.
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) settle(false);
    });

    // Backup for any other way the box gets closed. A late "close" event from
    // an earlier box must not cancel a newer box that is open again by now.
    dialog.addEventListener("close", function () {
      if (!dialog.open) settle(false);
    });
  }

  // Give the answer once and close the box. With a text field, the answer
  // is the text (or null).
  function settle(confirmed) {
    if (withInput && confirmed && !fieldInput.value.trim()) {
      fieldInput.focus(); // nothing typed: keep the box open
      return;
    }
    var resolve = resolveCurrent;
    resolveCurrent = null;
    if (dialog.open) dialog.close();
    if (!resolve) return;
    resolve(withInput ? (confirmed ? fieldInput.value.trim() : null) : confirmed);
  }

  function folioConfirm(options) {
    options = options || {};

    // Very old browsers without <dialog>: fall back to the built-in pop-up.
    if (typeof window.HTMLDialogElement !== "function") {
      return Promise.resolve(window.confirm(options.message || options.title || ""));
    }

    if (!dialog) build();

    // If a box is still open, treat it as cancelled before opening a new one.
    if (resolveCurrent) {
      resolveCurrent(withInput ? null : false);
      resolveCurrent = null;
    }

    withInput = Boolean(options.input);
    field.hidden = !withInput;
    if (withInput) {
      fieldLabel.textContent = options.input.label || "";
      fieldInput.value = options.input.value || "";
      fieldInput.maxLength = options.input.maxLength || 100;
      fieldInput.type = options.input.type === "password" ? "password" : "text";
      fieldInput.autocomplete = options.input.type === "password" ? "current-password" : "off";
    }

    titleEl.textContent = options.title || "";
    messageEl.textContent = options.message || "";
    messageEl.hidden = !options.message;
    confirmButton.textContent = options.confirmLabel || "OK";
    cancelButton.textContent = options.cancelLabel || "Cancel";
    // Red by default (delete); tone: "primary" makes it blue for safe actions.
    var primary = options.tone === "primary";
    confirmButton.classList.toggle("folio-confirm__button--danger", !primary);
    confirmButton.classList.toggle("folio-confirm__button--primary", primary);

    return new Promise(function (resolve) {
      resolveCurrent = resolve;
      if (!dialog.open) dialog.showModal();
      // Start on Cancel, so a quick Enter never deletes anything; with a
      // text field, start in the field with the text selected.
      if (withInput) {
        fieldInput.focus();
        fieldInput.select();
      } else {
        cancelButton.focus();
      }
    });
  }

  window.folioConfirm = folioConfirm;
})();
