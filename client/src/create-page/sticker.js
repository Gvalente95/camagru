let stickerResizeCenterX = 0;
let stickerResizeCenterY = 0;
let stickerResizeStartDistance = 0;
let stickerResizeStartScale = 1;

function setupThumbnailCurrent() {
  const stickerWrapper = document.querySelector(".sticker-current-wrapper");
  stickerWrapper.addEventListener("mousedown", (e) => {
    e.preventDefault();
    IS_DRAGGING_VIGNETTE = true;
    const rect = stickerWrapper.getBoundingClientRect();
    stickerDragOffsetX = e.clientX - rect.left;
    stickerDragOffsetY = e.clientY - rect.top;
  });

  const stickerResizer = document.querySelector(".sticker-resizer");

  stickerResizer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    IS_RESIZING_VIGNETTE = true;
    const rect = stickerWrapper.getBoundingClientRect();
    stickerResizeCenterX = rect.left + rect.width / 2;
    stickerResizeCenterY = rect.top + rect.height / 2;
    stickerResizeStartDistance = Math.hypot(e.clientX - stickerResizeCenterX, e.clientY - stickerResizeCenterY);
    stickerResizeStartScale = parseFloat(stickerWrapper.style.scale) || 1;
  });

  function dragVignette(e) {
    const container = document.querySelector(".video-container");
    const containerRect = container.getBoundingClientRect();
    const stickerRect = stickerWrapper.getBoundingClientRect();

    const nextX = e.clientX - containerRect.left - stickerDragOffsetX;
    const nextY = e.clientY - containerRect.top - stickerDragOffsetY;

    stickerWrapper.style.left = `${clamp(nextX, 0, containerRect.width - stickerRect.width)}px`;
    stickerWrapper.style.top = `${clamp(nextY, 0, containerRect.height - stickerRect.height)}px`;
  }
  function resizeVignette(e) {
    const distance = Math.hypot(e.clientX - stickerResizeCenterX, e.clientY - stickerResizeCenterY);
    const scale = stickerResizeStartScale * (distance / stickerResizeStartDistance);
    stickerWrapper.style.scale = clamp(scale, 0.2, 2);
  }

  document.addEventListener("mousemove", (e) => {
    if (IS_DRAGGING_VIGNETTE) dragVignette(e);
    else if (IS_RESIZING_VIGNETTE) resizeVignette(e);
  });

  document.addEventListener("mouseup", () => {
    IS_DRAGGING_VIGNETTE = false;
    IS_RESIZING_VIGNETTE = false;
  });
}

function onThumbnailClick(img, stickerData) {
  const prev = document.querySelector(".sticker-image.selected");
  if (prev) prev.classList.remove("selected");
  SELECTED_THUMBNAIL_ID = stickerData.id;
  const wrapper = document.querySelector(".sticker-current-wrapper");
  const currentImage = wrapper.querySelector(".sticker-current");

  wrapper.hidden = false;
  currentImage.src = img.src;
  img.classList.add("selected");
  if (UPLOADED_BG) toggleCaptureButton(true);
}

function handleThumbnailClick(e, img, stickerData) {
  playAudio(AUDIO.click);
  e.preventDefault();
  if (SELECTED_THUMBNAIL_ID === stickerData.id) return;

  setClassVisibility("sticker-message", false);
  if (!IS_RECORDING && !UPLOADED_BG)
    startWebcamStream().then(() => {
      onThumbnailClick(img, stickerData);
    });
  else onThumbnailClick(img, stickerData);
}

async function initThumbnailList() {
  const stickersMetadata = await fetchStickers();
  const listElement = document.querySelector(".sticker-list");

  for (const stickerData of stickersMetadata) {
    const img = document.createElement("img");
    img.className = "sticker-image";
    img.src = `${API}/sticker/${stickerData.id}`;
    img.onclick = (e) => handleThumbnailClick(e, img, stickerData);
    listElement.appendChild(img);
  }
}

async function initThumbnails() {
  await initThumbnailList();
  setupThumbnailCurrent();
}
