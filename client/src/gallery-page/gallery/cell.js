async function updateGalleryCell(cell, imageData) {
  const { id, user_id, liked_by_me, like_count, username, comment_count } = imageData;

  const currentUserId = CURRENT_USER?.id ?? null;

  const imageContainer = cell.querySelector(".cell-image-container");
  const overlay = cell.querySelector(".cell-overlay");
  const label = overlay.querySelector(".cell-label");
  const image = imageContainer.querySelector(".cell-image");
  const controls = overlay.querySelector(".cell-controls");

  label.textContent = username;

  const src = `${API}/images/${id}`;

  if (image.src !== src) image.src = src;

  controls.replaceChildren();

  const likeEl = addElement(() => toggleLike(id), "like-icon.svg", like_count);

  if (!currentUserId) likeEl.disabled = true;
  likeEl.classList.toggle("liked", liked_by_me);
  controls.appendChild(likeEl);

  const commentEl = addElement(() => toggleCommentsView(id), "comment-icon.svg", comment_count);

  commentEl.hidden = !currentUserId && comment_count === 0;

  controls.appendChild(commentEl);

  overlay.querySelector(".image-delete-button")?.remove();

  if (currentUserId && Number(currentUserId) === Number(user_id)) {
    const el = addElement(() => openDeleteImageForm(id), "delete.svg");
    el.className = "image-delete-button";
    overlay.appendChild(el);
  }
}

function createGalleryCell(id, isMine) {
  const cell = document.createElement("div");
  cell.className = `cell${isMine ? " mine" : ""}`;
  cell.id = `gallery-image_${id}`;
  cell.dataset.imageId = id;

  cell.onclick = (e) => {
    if (e.target.closest(".comment-list, .cell-controls")) return;
    openImageDialog(id);
  };

  const imageContainer = document.createElement("div");
  imageContainer.className = "cell-image-container";

  const image = document.createElement("img");
  image.className = "cell-image";

  const overlay = document.createElement("div");
  overlay.className = "cell-overlay";

  const label = document.createElement("label");
  label.className = "cell-label";

  const controls = document.createElement("div");
  controls.className = "cell-controls";

  overlay.appendChild(label);
  overlay.appendChild(controls);

  imageContainer.appendChild(image);
  imageContainer.appendChild(overlay);

  cell.appendChild(imageContainer);

  return cell;
}

async function createAllCells() {
  const gridElement = document.querySelector(".images-grid");
  gridElement.replaceChildren();

  for (const image of ALL_IMAGES) {
    const isMine = CURRENT_USER && image.user_id === CURRENT_USER.id;
    const cell = createGalleryCell(image.id, isMine);
    gridElement.appendChild(cell);
    await updateGalleryCell(cell, image);
  }

  setImageRatios();
}
