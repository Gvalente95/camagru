function updateDom() {
  const is_authenticated = CURRENT_USER !== null;

  setIdVisibility("login-button", !is_authenticated);
  setIdVisibility("signup-button", !is_authenticated);
  setIdVisibility("logout-button", is_authenticated);

  setIdVisibility("notification", NOTIFICATION !== null);
  setIdVisibility("overlay", FORM_TYPE !== null);
  setIdVisibility("login-form", FORM_TYPE === "login");
  setIdVisibility("signup-form", FORM_TYPE === "signup");
  setIdVisibility("reset-password-form", FORM_TYPE === "reset-password");
  setIdVisibility("send-reset-password-form", FORM_TYPE === "send-reset-password");

  resetPromptForm();
}
