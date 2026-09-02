let stickerResizeCenterX = 0;
let stickerResizeCenterY = 0;
let stickerResizeStartDistance = 0;
let stickerResizeStartScale = 1;

function setupStickerCurrent() {
  const stickerWrapper = document.querySelector(".sticker-current-wrapper");
  const stickerResizer = document.querySelector(".sticker-resizer");

  stickerWrapper.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    IS_DRAGGING_VIGNETTE = true;

    stickerWrapper.setPointerCapture(e.pointerId);

    const rect = stickerWrapper.getBoundingClientRect();

    stickerDragOffsetX = e.clientX - rect.left;
    stickerDragOffsetY = e.clientY - rect.top;
  });

  stickerResizer.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();

    IS_RESIZING_VIGNETTE = true;

    stickerResizer.setPointerCapture(e.pointerId);

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

  document.addEventListener("pointermove", (e) => {
    if (IS_DRAGGING_VIGNETTE) {
      e.preventDefault();
      dragVignette(e);
    } else if (IS_RESIZING_VIGNETTE) {
      e.preventDefault();
      resizeVignette(e);
    }
  });

  document.addEventListener("pointerup", () => {
    IS_DRAGGING_VIGNETTE = false;
    IS_RESIZING_VIGNETTE = false;
  });

  document.addEventListener("pointercancel", () => {
    IS_DRAGGING_VIGNETTE = false;
    IS_RESIZING_VIGNETTE = false;
  });
}

function onStickerClick(button, stickerId) {
  const prev = document.querySelector(".sticker-button.selected");
  if (prev) prev.classList.remove("selected");
  SELECTED_STICKER_ID = stickerId;
  const wrapper = document.querySelector(".sticker-current-wrapper");
  const currentImage = wrapper.querySelector(".sticker-current");

  wrapper.hidden = false;
  const img = button.children[0];
  currentImage.src = img.src;
  button.classList.add("selected");
  if (UPLOADED_BG) toggleCaptureButton(true);
}

function handleStickerClick(e, button, stickerId) {
  e.preventDefault();

  if (SELECTED_STICKER_ID === stickerId) return;

  playAudio(AUDIO.click);

  document.querySelectorAll(".sticker-button.selected").forEach((el) => {
    el.classList.remove("selected");
  });

  button.classList.add("selected");

  setClassVisibility("sticker-message", false);

  if (!IS_RECORDING && !UPLOADED_BG && CAN_USE_RECORDER) {
    startWebcamStream().then(() => {
      onStickerClick(button, stickerId);
    });
  } else onStickerClick(button, stickerId);
}

async function loadStickerList() {
  const stickersMetadata = await fetchStickers();
  const listElement = document.querySelector(".sticker-list");

  listElement.querySelectorAll(".sticker-button").forEach((el) => el.remove());

  for (const { id, user_id } of stickersMetadata) {
    const isMine = CURRENT_USER && user_id === CURRENT_USER.id;

    const buttonEl = document.createElement("div");
    buttonEl.className = `sticker-button${isMine ? " mine" : ""}`;

    const img = document.createElement("img");
    img.src = `${API}/stickers/${id}`;
    img.onclick = (e) => handleStickerClick(e, buttonEl, id);

    buttonEl.appendChild(img);

    if (isMine) {
      const delElement = document.createElement("button");
      delElement.className = "sticker-delete-button";

      const delIcon = document.createElement("img");
      delIcon.src = "/assets/icons/delete.png";
      delIcon.className = "sticker-delete-icon";

      delElement.appendChild(delIcon);
      delElement.onclick = () => {
        openDeleteStickerForm(id);
      };

      buttonEl.appendChild(delElement);
    }

    listElement.appendChild(buttonEl);
  }
}

async function initStickers() {
  await loadStickerList();
  setupStickerCurrent();
}

async function handleStickerCreation(input) {
  const image = input.files?.[0];
  if (!image) return;
  const res = await createSticker(image);
  if (res.ok) loadStickerList();
  input.value = "";
}
