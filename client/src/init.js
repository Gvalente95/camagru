async function init() {
  let hasVerifStatus = handleVerificationStatus() || handlePasswordResetLink();
  let isInChangeLink = !hasVerifStatus && handleEmailChangeLink();

  if (!hasVerifStatus) await update_auth_api();

  updateDom();

  const path = window.location.pathname;
  if (CURRENT_USER && path === "/" && !hasVerifStatus && !isInChangeLink) {
    setLocation("/gallery");
    return;
  }
  if ((path === "/gallery" || path === "/edit" || path === "/account") && !CURRENT_USER) {
    setLocation("/forbidden");
    return;
  }

  setClassVisibility("header-title", !isMobile() || !CURRENT_USER);
}

function handleVerificationStatus() {
  const params = new URLSearchParams(window.location.search);
  const verification = params.get("verify-email");
  if (verification === "success") {
    toggleNotification("Email verified successfully", "green");
    togglePrompt("login");
  } else if (verification === "invalid") setLocation("/invalid");
  else return false;
  return true;
}

function handlePasswordResetLink() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("reset-password");

  if (!token) return false;

  PASSWORD_RESET_TOKEN = token;
  togglePrompt("reset-password");
  return true;
}

function handleEmailChangeLink() {
  const params = new URLSearchParams(window.location.search);
  const verification = params.get("change-email");
  if (verification === "success") {
    toggleNotification("Email updated successfully!", "green");
  } else if (verification === "invalid") setLocation("/invalid");
  else return false;
  return true;
}
