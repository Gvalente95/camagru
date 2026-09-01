const signup = async (name, password, email) =>
  fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

const login = async (name, password) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      password,
    }),
  });

  if (res.ok) {
    getMe();
    setLocation("/");
  }

  return res;
};

const logout = async () => {
  const res = await fetch(`${API}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (res.ok) setLocation("/");
  return res;
};

const getMe = async () => {
  const res = await fetch(`${API}/me`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!data.authenticated) {
    CURRENT_USER = null;
    return;
  }

  const user = data.user;

  CURRENT_USER = {
    name: user.name,
    email: user.email,
    id: user.id,
    dark_mode: user.dark_mode,
    notify_comment: user.notify_comment,
  };

  setDarkMode(CURRENT_USER.dark_mode);
};
