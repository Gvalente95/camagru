function getBaseCanvasSize() {
  const video = document.getElementById("webcam");
  const background = document.querySelector(".video-background");

  if (IS_RECORDING && video) {
    return {
      width: video.videoWidth,
      height: video.videoHeight,
    };
  }

  if (UPLOADED_BG && background) {
    const rect = background.getBoundingClientRect();

    const width = 1280;
    const height = width * (rect.height / rect.width);

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  return { width: 1280, height: 720 };
}

function getOverlayPlacement() {
  const background = document.querySelector(".video-background");
  const overlay = document.querySelector(".sticker-current-wrapper");

  if (!background || !overlay) {
    return null;
  }

  const { width: baseWidth, height: baseHeight } = getBaseCanvasSize();

  const baseRect = background.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();

  const scale = baseWidth / baseRect.width;

  const x = (overlayRect.left - baseRect.left) * scale;
  const y = (overlayRect.top - baseRect.top) * scale;

  const width = overlayRect.width * scale;
  const height = overlayRect.height * scale;

  return {
    x,
    y,
    width,
    height,
  };
}

function captureBaseImage() {
  const canvas = document.getElementById("snapshot");
  const ctx = canvas.getContext("2d");
  const { width, height } = getBaseCanvasSize();

  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  if (IS_RECORDING) {
    const video = document.getElementById("webcam");
    if (video) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();
    }
  } else if (UPLOADED_BG) {
    const background = document.querySelector(".video-background");
    if (background) {
      ctx.drawImage(background, 0, 0, width, height);
    }
  }

  return canvas;
}

function waitForPhoto(seconds = 3) {
  const start = performance.now();
  const duration = seconds * 1000;
  let previousRemaining = null;

  const el = document.querySelector(".video-wait-button");
  el.classList.add("active");

  function loopWait(now) {
    const elapsed = now - start;
    const remaining = Math.ceil((duration - elapsed) / 1000);

    if (remaining !== previousRemaining) {
      previousRemaining = remaining;
      el.textContent = remaining;
      if (remaining > 0) playAudio(AUDIO.notification);
    }

    if (elapsed >= duration) {
      CAN_TAKE_PHOTO = true;
      el.textContent = seconds;
      captureImage(true);
      el.classList.remove("active");
      return;
    }
    requestAnimationFrame(loopWait);
  }
  requestAnimationFrame(loopWait);
}

async function captureImage(force = false) {
  if (!SELECTED_STICKER_ID) return;
  if (!CAN_TAKE_PHOTO) return;

  CAN_TAKE_PHOTO = false;

  document.querySelector(".capture-webcam-button").disabled = true;

  if (USE_PHOTO_WAIT && !force) {
    waitForPhoto(3);
    return;
  }

  const flashOverlay = document.querySelector(".flash-overlay");
  flashOverlay.className = "flash-overlay flash";
  setTimeout(() => {
    flashOverlay.className = "flash-overlay";
  }, 200);
  playAudio(AUDIO.capture);

  const baseCanvas = captureBaseImage();

  const baseBlob = await canvasToBlob(baseCanvas);

  const res = await createImage(baseBlob, SELECTED_STICKER_ID, getOverlayPlacement());

  if (res.ok) {
    const data = await res.json();
    HAS_UNSAVED_CHANGES = true;
    CAPTURED_IMAGE_IDS.push(data.id);
    updateSideImages();
    if (SELECTED_STICKER_ID) document.querySelector(".capture-webcam-button").disabled = false;
    CAN_TAKE_PHOTO = true;
  } else {
    const error = await res.json();
    document.querySelector(".capture-webcam-button").disabled = false;
    CAN_TAKE_PHOTO = true;
  }
}
