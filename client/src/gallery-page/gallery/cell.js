async function updateGalleryCell(cell, imageData) {
  const { id, user_id, liked_by_me, like_count, username, comment_count } = imageData;

  const currentUserId = CURRENT_USER?.id ?? null;

  const imageContainer = cell.querySelector(".cell-image-container");
  const label = imageContainer.querySelector(".cell-label");
  const image = imageContainer.querySelector(".cell-image");
  const controls = imageContainer.querySelector(".cell-controls");

  label.textContent = username;

  const src = `${API}/images/${id}`;

  if (image.src !== src) {
    image.src = src;
  }

  controls.replaceChildren();

  const likeEl = addElement(() => toggleLike(id), "like-icon.svg", like_count);

  if (!currentUserId) likeEl.disabled = true;
  likeEl.classList.toggle("liked", liked_by_me);
  controls.appendChild(likeEl);

  const commentEl = addElement(() => toggleCommentsView(id), "comment-icon.svg", comment_count);

  commentEl.hidden = !currentUserId && comment_count === 0;

  controls.appendChild(commentEl);

  if (currentUserId && Number(currentUserId) === Number(user_id)) {
    const el = addElement(() => openDeleteImageForm(id), "delete.png");
    el.className = "image-delete-button";
    imageContainer.appendChild(el);
  }
}

function selectCell(id) {
  const imageData = ALL_IMAGES.find((image) => image.id === id);
  if (!imageData) return;

  const dialog = document.querySelector(".selected-cell");
  const image = dialog.querySelector(".selected-cell-image");

  image.src = `${API}/images/${id}`;

  dialog.showModal();
}

function createGalleryCell(id, isMine) {
  const cell = document.createElement("div");
  cell.className = `cell${isMine ? " mine" : ""}`;
  cell.id = `gallery-image_${id}`;
  cell.dataset.imageId = id;
  cell.onclick = (e) => {
    if (e.target.closest(".comment-list, .cell-controls")) return;
    selectCell(id);
  };

  const label = document.createElement("label");
  label.className = "cell-label";

  const image = document.createElement("img");
  image.className = "cell-image";

  const controls = document.createElement("div");
  controls.className = "cell-controls";

  const imageContainer = document.createElement("div");
  imageContainer.className = "cell-image-container";
  imageContainer.appendChild(label);
  imageContainer.appendChild(image);
  imageContainer.appendChild(controls);

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
