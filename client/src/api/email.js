const sendResetPasswordEmail = async (name, email) =>
  fetch(`${API}/forgot-password`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ name, email }),
  });

const sendChangeEmail = async (new_email) =>
  fetch(`${API}/change-email`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ new_email }),
  });

const patchEmail = async (email) =>
  fetch(`${API}/my-email`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ email }),
  });
