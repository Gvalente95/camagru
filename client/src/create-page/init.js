function initInputBg() {
  const input = document.getElementById("input-bg");

  input.addEventListener("change", (event) => {
    playAudio(AUDIO.click);

    const file = event.target.files[0];
    if (!file) return;

    UPLOADED_BG = URL.createObjectURL(file);

    const videoBg = document.querySelector(".video-background");

    videoBg.hidden = false;
    videoBg.src = UPLOADED_BG;

    setClassVisibility("erase-bg-button", true);
    setClassVisibility("video-error-message", false);
    stopWebcam();

    if (SELECTED_STICKER_ID) toggleCaptureButton(true);
  });

  setClassVisibility("erase-bg-button", false);
}

async function initEditPage() {
  watchCameraPermission();
  initInputBg();
  initStickers();
  initImageDialog();
}
