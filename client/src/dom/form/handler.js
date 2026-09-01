function getCurrentForm() {
  if (window.location.pathname === "/account") {
    const el = document.getElementById("account-form");
    return el;
  }
  const form = FORM_TYPE ? document.getElementById(`${FORM_TYPE}-form`) : null;
  return form;
}

function updateSubmitState(form) {
  const inputs = [...form.querySelectorAll("input")];

  const changed = inputs.some((input) => {
    if (input.type === "checkbox") {
      playAudio(AUDIO.click);
      return input.checked !== input.defaultChecked;
    }

    return input.value !== input.defaultValue;
  });

  const invalidChangedTextInput = inputs.some((input) => {
    if (input.type === "checkbox") return false;

    const wasChanged = input.value !== input.defaultValue;

    return wasChanged && input.value.trim() === "";
  });

  form.querySelector('[type="submit"]').disabled = !changed || invalidChangedTextInput;
}

async function handleSendPasswordResetEmail(event, form) {
  event.preventDefault();
  togglePromptError(null);

  const email = form.querySelector('[name="femail"]')?.value || undefined;
  const name = form.querySelector('[name="fname"]')?.value || undefined;

  if (!email) {
    togglePromptError("Unvalid email.");
  }
  if (!name) {
    togglePromptError("Unvalid name");
  }
  const err = validateEmail(email);
  if (err) {
    togglePromptError(err);
    return;
  }
  const res = await sendResetPasswordEmail(name, email);

  if (res.ok) {
    toggleNotification(`Reset password Email Successfully sent to ${email}!`);
    togglePrompt("login");
  } else {
    const data = await res.json();
    togglePromptError(data.error ?? "Internal Error");
  }
}

async function handleLoginConfirm(event, form) {
  event.preventDefault();
  togglePromptError(null);

  const name = form.querySelector('[name="fname"]')?.value;
  const password = form.querySelector('[name="fpassword"]')?.value;
  const email = form.querySelector('[name="femail"]')?.value || undefined;

  let res = await login(name, password);

  if (res.ok) {
    // togglePrompt(null);
    setLocation("/account");
  } else {
    let data = await res.json();
    togglePromptError(data.error ?? "Error: Wrong Credentials");
  }
}

async function handleSignupConfirm(event, form) {
  event.preventDefault();
  togglePromptError(null);

  let error = validateCredentials(form);
  if (error) {
    togglePromptError(error);
    return;
  }

  const name = form.querySelector('[name="fname"]')?.value;
  const password = form.querySelector('[name="fpassword"]')?.value;
  const email = form.querySelector('[name="femail"]')?.value || undefined;

  let res = await signup(name, password, email);

  if (res.ok) {
    toggleNotification(`Verification Email Successfully sent to ${email}!`);
    togglePrompt("login");
  } else {
    let data = await res.json();
    togglePromptError(data.error ?? "Error: Wrong Credentials");
  }
}

async function handleResetPasswordConfirm(event, form) {
  event.preventDefault();
  togglePromptError(null);
  const password = form.querySelector('[name="fpassword"]')?.value;
  const err = validatePassword(password);
  if (err) {
    togglePromptError(err, "green");
    return;
  }
  let res = await resetUserPassword(password);
  if (res.ok) {
    toggleNotification("Password successfully changed!", "green");
    togglePrompt("login");
  } else {
    let data = await res.json();
    togglePromptError(data.error ?? "Internal error");
  }
}

async function handleAccountForm(event, form) {
  event.preventDefault();
  togglePromptError(null);
  playAudio(AUDIO.click);

  if (!CURRENT_USER) return;

  const name = form.querySelector('[name="fname"]')?.value;
  const password = form.querySelector('[name="fpassword"]')?.value;
  const email = form.querySelector('[name="femail"]')?.value || undefined;
  const darkModeInput = form.querySelector('[name="fdark_mode"]');
  const notifyCommentsInput = form.querySelector('[name="fnotify_comment"]');

  const darkMode = darkModeInput ? darkModeInput.checked : undefined;
  const notifyComments = notifyCommentsInput ? notifyCommentsInput.checked : undefined;

  if (password || name !== CURRENT_USER.name) {
    const err = validateCredentials(form);
    if (err) {
      togglePromptError(err);
      return;
    }
  }

  let notif = null;

  if (name !== CURRENT_USER.name || password) {
    const res = await patchCredentials(name, password);

    if (!res.ok) {
      const data = await res.json();
      togglePromptError(data.error ?? "Error: Wrong Values");
      return;
    }

    notif = "Account information successfully updated!";
  }

  if (email !== CURRENT_USER.email) {
    const res = await sendChangeEmail(email);

    if (!res.ok) {
      const data = await res.json();
      togglePromptError(data.error ?? "Error: Change Email");
      return;
    }

    if (notif) notif += " - ";
    notif += `Email change request sent to ${email}`;
  }

  if (darkMode !== CURRENT_USER.dark_mode || notifyComments !== CURRENT_USER.notify_comment) {
    const res = await patchUserSettings(darkMode, notifyComments);
    if (!res.ok) {
      const data = await res.json();
      togglePromptError(data.error ?? "Error: User Settings");
      return;
    }
    toggleNotification("User settings successfully changed!");
  }

  await getMe();

  togglePrompt(null);

  if (notif) {
    toggleNotification(notif);
  }

  updateDom();
}
