function getBaseCanvasSize() {
  const video = document.getElementById("webcam");
  const background = document.querySelector(".video-background");

  if (IS_RECORDING && video) {
    return { width: video.videoWidth, height: video.videoHeight };
  }

  if (UPLOADED_BG && background) {
    return { width: background.naturalWidth, height: background.naturalHeight };
  }

  return { width: 1280, height: 720 };
}

function getOverlayPlacement() {
  const container = document.querySelector(".video-container");
  const overlay = document.querySelector(".thumbnail-current-wrapper");

  if (!container || !overlay) {
    return null;
  }

  const { width: baseWidth, height: baseHeight } = getBaseCanvasSize();
  const containerRect = container.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();

  const x = ((overlayRect.left - containerRect.left) / containerRect.width) * baseWidth;
  const y = ((overlayRect.top - containerRect.top) / containerRect.height) * baseHeight;
  const w = (overlayRect.width / containerRect.width) * baseWidth;
  const h = (overlayRect.height / containerRect.height) * baseHeight;

  return { x, y, width: w, height: h };
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

async function captureImage() {
  if (!SELECTED_THUMBNAIL_ID) return;

  const flashOverlay = document.querySelector(".flash-overlay");
  flashOverlay.className = "flash-overlay flash";
  setTimeout(() => {
    flashOverlay.className = "flash-overlay";
  }, 200);

  const baseCanvas = captureBaseImage();

  const baseBlob = await canvasToBlob(baseCanvas);

  const res = await createImage(baseBlob, SELECTED_THUMBNAIL_ID, getOverlayPlacement());

  if (res.ok) {
    const data = await res.json();
    HAS_UNSAVED_CHANGES = true;
    CAPTURED_IMAGE_IDS.push(data.id);
    updateSideImages();
  } else {
    const error = await res.json();
    console.warn(error);
  }
}
