function setLocation(pathName) {
  window.location.href = pathName;
}

function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function setClassVisibility(className, visible) {
  const el = document.querySelector(`.${className}`);
  if (el) el.hidden = !visible;
}

function setIdVisibility(id, visible) {
  const el = document.getElementById(id);
  if (el) el.hidden = !visible;
}

function setClassDisabled(className, disabled) {
  const el = document.querySelector(`.${className}`);
  if (el) el.disabled = disabled;
}

function setIdDisabled(id, disabled) {
  const el = document.getElementById(id);
  if (el) el.disabled = disabled;
}

function setDarkMode(dark) {
  console.warn("DARK MODE SET TO = ", dark);
  document.documentElement.classList.toggle("dark", dark);
}

function isDarkMode() {
  const isDark = document.documentElement.classList.contains("dark");
}
