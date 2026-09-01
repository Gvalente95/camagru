function eraseBg() {
  if (UPLOADED_BG) {
    URL.revokeObjectURL(UPLOADED_BG);
  }
  UPLOADED_BG = null;
  document.getElementById("input-bg").value = "";

  const videoBg = document.querySelector(".video-background");
  videoBg.src = "";
  videoBg.hidden = true;
  setClassVisibility("erase-bg-button", false);
  toggleCaptureButton(false);
  startWebcamStream();
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
}
