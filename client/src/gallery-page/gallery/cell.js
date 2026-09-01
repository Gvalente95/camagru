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

  if (!currentUserId) {
    likeEl.disabled = true;
  }

  if (liked_by_me) {
    likeEl.style.background = "rgba(124, 169, 95, 0.28)";
  }

  controls.appendChild(likeEl);

  const commentEl = addElement(() => toggleCommentsView(id), "comment-icon.svg", comment_count);

  commentEl.hidden = !currentUserId && comment_count === 0;

  controls.appendChild(commentEl);

  if (currentUserId && Number(currentUserId) === Number(user_id)) {
    controls.appendChild(addElement(() => handleDeleteImage(id), "delete.png"));
  }
}

function createGalleryCell(id, isMine) {
  const cell = document.createElement("div");
  cell.className = `cell${isMine ? " mine" : ""}`;
  cell.id = `gallery-image_${id}`;
  cell.dataset.imageId = id;

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
