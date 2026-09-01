const resetUserPassword = async (password) =>
  fetch(`${API}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: PASSWORD_RESET_TOKEN,
      password,
    }),
  });

const patchCredentials = async (name, password) =>
  fetch(`${API}/me`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ name, password, dark_mode, notify_comment }),
  });

const patchUserSettings = async (dark_mode, notify_comment) =>
  fetch(`${API}/me`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ dark_mode, notify_comment }),
  });
