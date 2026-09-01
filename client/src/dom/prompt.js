const togglePrompt = (type) => {
  FORM_TYPE = type;
  updateDom();
};

const togglePromptError = (error) => {
  FORM_ERROR = error;
  const errorLabel = getCurrentForm()?.querySelector(".error-label");
  errorLabel.textContent = FORM_ERROR ?? "";
};

function resetPromptForm() {
  const form = getCurrentForm();

  if (form) {
    form.reset();
    if (window.location.pathname === "/account" && CURRENT_USER) {
      const nameInput = form.querySelector('[name="fname"]');
      const emailInput = form.querySelector('[name="femail"]');
      const formTitle = document.querySelector(".ftitle");
      const darkModeInput = document.querySelector('[name="fdark_mode"]');
      const notifyCommentsInput = document.querySelector('[name="fnotify_comment"]');

      formTitle.textContent = CURRENT_USER.name;
      nameInput.value = CURRENT_USER.name;
      nameInput.defaultValue = CURRENT_USER.name;
      emailInput.value = CURRENT_USER.email;
      emailInput.defaultValue = CURRENT_USER.email;
      darkModeInput.checked = CURRENT_USER.dark_mode;
      darkModeInput.defaultChecked = CURRENT_USER.dark_mode;
      notifyCommentsInput.checked = CURRENT_USER.notify_comment;
      notifyCommentsInput.defaultChecked = CURRENT_USER.notify_comment;
    }
  }
  FORM_ERROR = null;
  togglePromptKeys(FORM_TYPE);
}

function togglePromptKeys(enable) {
  function togglePromptKey(e) {
    const key = e.key;
    if (key === "Escape") togglePrompt(null);
  }
  if (enable) {
    document.addEventListener("keydown", (e) => {
      togglePromptKey(e);
    });
  } else {
    document.body.removeEventListener("keydown", togglePromptKey);
  }
}

function toggleNotification(notification, color = "green") {
  function resetNotification(text = "", color = "green", hidden = true) {
    const el = document.getElementById("notification");
    el.textContent = text;
    el.style.color = color;
    el.hidden = hidden;
  }

  NOTIFICATION = notification;
  if (NOTIFICATION != null) {
    resetNotification(notification, color, false);
    setTimeout(() => {
      NOTIFICATION = null;
      resetNotification();
    }, 2000);
  } else resetNotification();
}
