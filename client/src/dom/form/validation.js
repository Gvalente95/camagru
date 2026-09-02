function validateName(name) {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;

  if (!name || name.length < NAME_LENGTH_MIN || name.length > NAME_LENGTH_MAX) {
    return `Name must be between ${NAME_LENGTH_MIN} and ${NAME_LENGTH_MAX} characters`;
  }
  if (!usernameRegex.test(name)) {
    return "Name can only contain letters, numbers, underscores and hyphens";
  }
  return null;
}

function validatePassword(password, onlyCheckEmpty = false) {
  if (onlyCheckEmpty) return password ? null : "Password required";

  if (!password || password.length < PASS_LENGTH_MIN || password.length > PASS_LENGTH_MAX) {
    return `Password must be between ${PASS_LENGTH_MIN} and ${PASS_LENGTH_MAX} characters`;
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) return "Invalid email address";
  return null;
}

function validateCredentials(form, onlyCheckEmptyPassword = false) {
  const name = form.querySelector('[name="fname"]')?.value;
  const password = form.querySelector('[name="fpassword"]')?.value;
  const email = form.querySelector('[name="femail"]')?.value || undefined;

  const nameError = validateName(name);
  if (nameError) return nameError;
  const passError = validatePassword(password, onlyCheckEmptyPassword);
  if (passError) return passError;
  const emailError = validateEmail(email);
  if (emailError) return emailError;
  return null;
}
