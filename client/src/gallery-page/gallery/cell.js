async function updateGalleryCell(cell, imageData) {
  const { id, user_id, liked_by_me, like_count, username, comment_count } = imageData;

  const currentUserId = CURRENT_USER?.id ?? null;

  const label = cell.querySelector(".cell-label");
  const image = cell.querySelector(".cell-image");
  const controls = cell.querySelector(".cell-controls");

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

  if (VIEWED_COMMENTS_ID === id) {
    const existing = cell.querySelector(".comments-container");

    if (!existing) {
      const comments = await addCommentsList(id);
      cell.appendChild(comments);
    }
  } else {
    cell.querySelector(".comments-container")?.remove();
  }
}

function createGalleryCell(id) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.id = `gallery-image_${id}`;
  cell.dataset.imageId = id;

  const label = document.createElement("label");
  label.className = "cell-label";

  const image = document.createElement("img");
  image.className = "cell-image";

  const controls = document.createElement("div");
  controls.className = "cell-controls";

  cell.appendChild(label);
  cell.appendChild(image);
  cell.appendChild(controls);

  return cell;
}
