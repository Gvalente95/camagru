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
  document.documentElement.classList.toggle("dark", dark);
}

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function playAudio(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function toggleOverlay(visible) {
  setClassVisibility("overlay", visible);
}
