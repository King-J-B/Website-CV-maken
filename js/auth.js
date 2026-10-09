/* ==========================================================================
   Folio — authentication logic (no dependencies)

   Handles: client-side validation, password visibility toggles, submit state,
   server error display, the forgot-password request → sent states, and social
   sign-in links.

   Configure before this script loads (optional):

     <script>
       window.FOLIO_AUTH_CONFIG = {
         apiBase: "api",                // the PHP files in api/; null = demo mode (no network)
         afterAuthUrl: "my-resumes.html", // My resumes (flow: Sign in / Sign up → My resumes)
         providers: { google: "/auth/google", linkedin: "/auth/linkedin" }
       };
     </script>
   ========================================================================== */

(function () {
  "use strict";

  var config = Object.assign(
    {
      apiBase: "api", // api/sign-in.php, api/sign-up.php (relative, so it works in a subfolder)
      afterAuthUrl: "my-resumes.html", // My resumes (flow: Sign in / Sign up → My resumes)
      providers: { google: "/auth/google", linkedin: "/auth/linkedin" }
    },
    window.FOLIO_AUTH_CONFIG || {}
  );

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ------------------------------------------------------------------------
     API layer — swap these three calls for your backend if the shape differs.
     Each resolves on success and rejects with an Error whose message is shown
     to the user. Optionally set error.fields = { email: "…" } for field errors.
     ------------------------------------------------------------------------ */

  // Demo mode: pretend the server accepted the request.
  function demo() {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve({ ok: true });
      }, 700);
    });
  }

  function request(path, payload) {
    if (!config.apiBase) return demo();

    return fetch(config.apiBase + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload)
    }).then(
      function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (body) {
            if (response.ok) return body;
            var error = new Error(body.message || "Something went wrong. Please try again.");
            error.fields = body.fields || null;
            throw error;
          });
      },
      function () {
        throw new Error("We couldn't reach Folio. Check your connection and try again.");
      }
    );
  }

  var api = {
    signIn: function (data) {
      return request("/sign-in.php", data);
    },
    signUp: function (data) {
      return request("/sign-up.php", data);
    },
    // No reset e-mails yet: stays in demo mode until api/password-reset.php exists.
    requestPasswordReset: function () {
      return demo();
    }
  };

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */

  // Only same-site relative paths are accepted, so ?next= can't redirect off-site.
  function nextUrl() {
    var next = new URLSearchParams(window.location.search).get("next");
    if (next && /^\/(?![\/\\])/.test(next)) return next;
    return config.afterAuthUrl;
  }

  function errorElementFor(input) {
    return document.getElementById(input.id + "-error");
  }

  function setFieldError(input, message) {
    var errorEl = errorElementFor(input);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
    } else {
      input.removeAttribute("aria-invalid");
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.hidden = true;
      }
    }
  }

  function validateField(input, form) {
    var message = "";
    var messages = input.dataset;

    if (input.type === "checkbox") {
      if (input.required && !input.checked) {
        message = messages.msgRequired || "Tick this box to continue.";
      }
    } else {
      var value = input.type === "password" ? input.value : input.value.trim();
      var minLength = parseInt(input.dataset.minlength || "0", 10);

      if (input.required && !value) {
        message = messages.msgRequired || "This field is required.";
      } else if (value && input.dataset.validate === "email" && !EMAIL_PATTERN.test(value)) {
        message = messages.msgEmail || "Enter an email address like name@example.com.";
      } else if (value && minLength && value.length < minLength) {
        message = messages.msgMinlength || "Use at least " + minLength + " characters.";
      } else if (value && input.dataset.match) {
        var other = form.querySelector(input.dataset.match);
        if (other && other.value !== input.value) {
          message = messages.msgMatch || "The passwords don't match.";
        }
      }
    }

    setFieldError(input, message);
    return !message;
  }

  function fieldsOf(form) {
    return Array.prototype.slice.call(form.querySelectorAll("[data-validate], [required]"));
  }

  function validateForm(form) {
    var firstInvalid = null;
    fieldsOf(form).forEach(function (input) {
      if (!validateField(input, form) && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function setFormAlert(form, message) {
    var alertEl = form.querySelector("[data-form-alert]");
    if (!alertEl) return;
    alertEl.textContent = message || "";
    alertEl.hidden = !message;
  }

  function setBusy(form, busy) {
    var button = form.querySelector('[type="submit"]');
    if (!button) return;
    button.disabled = busy;
    button.dataset.loading = busy ? "true" : "false";
    button.setAttribute("aria-busy", busy ? "true" : "false");
  }

  function formData(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      if (el.type === "checkbox") data[el.name] = el.checked;
      else if (el.type === "password") data[el.name] = el.value;
      else data[el.name] = el.value.trim();
    });
    return data;
  }

  function applyServerErrors(form, error) {
    var focused = false;
    if (error.fields) {
      Object.keys(error.fields).forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        setFieldError(input, error.fields[name]);
        if (!focused) {
          input.focus();
          focused = true;
        }
      });
    }
    if (!focused) setFormAlert(form, error.message);
  }

  /* ------------------------------------------------------------------------
     Wiring
     ------------------------------------------------------------------------ */

  function wireValidation(form) {
    // Pressing the submit button would blur the current field first; its error
    // message then pushes the button down and the click misses. Keeping focus
    // in the field until the click lands avoids that.
    var submit = form.querySelector('[type="submit"]');
    if (submit) {
      submit.addEventListener("mousedown", function (event) {
        event.preventDefault();
      });
    }

    fieldsOf(form).forEach(function (input) {
      // Validate when leaving a field; once it has an error, re-check as the user fixes it.
      input.addEventListener("blur", function () {
        if (input.type === "checkbox" || input.value) validateField(input, form);
      });
      input.addEventListener(input.type === "checkbox" ? "change" : "input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateField(input, form);
      });
    });
  }

  function wirePasswordToggles(root) {
    root.querySelectorAll("[data-toggle-password]").forEach(function (button) {
      var input = document.getElementById(button.getAttribute("aria-controls"));
      if (!input) return;
      button.addEventListener("click", function () {
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        button.textContent = show ? "Hide" : "Show";
        button.setAttribute("aria-pressed", show ? "true" : "false");
        button.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });
  }

  function wireSocial(root) {
    root.querySelectorAll("[data-provider]").forEach(function (link) {
      var url = config.providers[link.dataset.provider];
      if (!url) return;
      var next = new URLSearchParams(window.location.search).get("next");
      link.href = next ? url + "?next=" + encodeURIComponent(nextUrl()) : url;
    });
  }

  // Keep ?next= when moving between Sign in / Sign up / Forgot password,
  // so a guest who chose "Save online" returns to the same CV afterwards.
  function wireQueryLinks(root) {
    if (!window.location.search) return;
    root.querySelectorAll("[data-keep-query]").forEach(function (link) {
      link.href = link.getAttribute("href").split("?")[0] + window.location.search;
    });
  }

  function wireAuthForm(form, action) {
    wireValidation(form);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setFormAlert(form, "");
      if (!validateForm(form)) return;

      setBusy(form, true);
      api[action](formData(form))
        .then(function () {
          window.location.assign(nextUrl());
        })
        .catch(function (error) {
          setBusy(form, false);
          applyServerErrors(form, error);
        });
    });
  }

  function wireResetForm(form) {
    var requestView = document.querySelector('[data-view="request"]');
    var sentView = document.querySelector('[data-view="sent"]');
    var sentEmail = document.querySelector("[data-sent-email]");
    var resendButton = document.querySelector("[data-resend]");
    var resendStatus = document.querySelector("[data-resend-status]");
    var email = "";

    wireValidation(form);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setFormAlert(form, "");
      if (!validateForm(form)) return;

      email = formData(form).email;
      setBusy(form, true);
      api
        .requestPasswordReset({ email: email })
        .then(function () {
          setBusy(form, false);
          if (sentEmail) sentEmail.textContent = email;
          requestView.hidden = true;
          sentView.hidden = false;
          var heading = sentView.querySelector("h1");
          if (heading) heading.focus();
          document.title = "Check your inbox · Folio";
        })
        .catch(function (error) {
          setBusy(form, false);
          applyServerErrors(form, error);
        });
    });

    if (resendButton) {
      resendButton.addEventListener("click", function () {
        resendButton.disabled = true;
        resendStatus.hidden = true;
        api
          .requestPasswordReset({ email: email })
          .then(function () {
            resendStatus.className = "alert alert--success";
            resendStatus.textContent = "We sent a new link to " + email + ".";
          })
          .catch(function (error) {
            resendStatus.className = "alert alert--danger";
            resendStatus.textContent = error.message;
          })
          .then(function () {
            resendStatus.hidden = false;
            resendButton.disabled = false;
          });
      });
    }
  }

  function init() {
    wirePasswordToggles(document);
    wireSocial(document);
    wireQueryLinks(document);

    document.querySelectorAll("form[data-auth-form]").forEach(function (form) {
      var kind = form.dataset.authForm;
      if (kind === "sign-in") wireAuthForm(form, "signIn");
      else if (kind === "sign-up") wireAuthForm(form, "signUp");
      else if (kind === "reset") wireResetForm(form);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposed so the app can replace the API calls or reuse the validators.
  window.FolioAuth = { api: api, config: config, validateForm: validateForm };
})();
