function setupThumbnailCurrent() {
  const thumbnailWrapper = document.querySelector(".thumbnail-current-wrapper");

  if (!thumbnailWrapper) return;

  thumbnailWrapper.addEventListener("mousedown", (e) => {
    e.preventDefault();
    IS_DRAGGING_VIGNETTE = true;

    const rect = thumbnailWrapper.getBoundingClientRect();
    thumbnailDragOffsetX = e.clientX - rect.left;
    thumbnailDragOffsetY = e.clientY - rect.top;
  });

  document.addEventListener("mousemove", (e) => {
    if (!IS_DRAGGING_VIGNETTE) return;

    const container = document.querySelector(".video-container");
    const rect = container.getBoundingClientRect();

    const nextX = e.clientX - rect.left - thumbnailDragOffsetX;
    const nextY = e.clientY - rect.top - thumbnailDragOffsetY;

    thumbnailWrapper.style.left = `${Math.max(0, Math.min(nextX, rect.width - thumbnailWrapper.offsetWidth))}px`;
    thumbnailWrapper.style.top = `${Math.max(0, Math.min(nextY, rect.height - thumbnailWrapper.offsetHeight))}px`;
  });

  document.addEventListener("mouseup", () => {
    IS_DRAGGING_VIGNETTE = false;
  });
}

function onThumbnailClick(img, thumbnailData) {
  const prev = document.querySelector(".thumbnail-image.selected");
  if (prev) prev.classList.remove("selected");
  SELECTED_THUMBNAIL_ID = thumbnailData.id;
  const wrapper = document.querySelector(".thumbnail-current-wrapper");
  const currentImage = wrapper.querySelector(".thumbnail-current");

  wrapper.hidden = false;
  currentImage.src = img.src;
  img.classList.add("selected");
  if (UPLOADED_BG) toggleCaptureButton(true);
}

function handleThumbnailClick(img, thumbnailData) {
  setClassVisibility("thumbnail-message", false);
  if (!IS_RECORDING && !UPLOADED_BG)
    startWebcamStream().then(() => {
      onThumbnailClick(img, thumbnailData);
    });
  else onThumbnailClick(img, thumbnailData);
}

async function initThumbnailList() {
  const thumbnailsMetadata = await fetchThumbnails();
  const listElement = document.querySelector(".thumbnail-list");

  for (const thumbnailData of thumbnailsMetadata) {
    const img = document.createElement("img");
    img.className = "thumbnail-image";
    img.src = `${API}/thumbnail/${thumbnailData.id}`;
    img.onclick = () => handleThumbnailClick(img, thumbnailData);
    listElement.appendChild(img);
  }
}

async function initThumbnails() {
  await initThumbnailList();
  setupThumbnailCurrent();
}
