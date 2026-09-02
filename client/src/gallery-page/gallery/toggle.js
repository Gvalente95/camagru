let currentClickHandler = null;

async function toggleCommentsView(imageId) {
  const cell = document.getElementById(`gallery-image_${imageId}`);
  if (!cell) return;

  playAudio(AUDIO.click);

  const existingContainer = cell.querySelector(".comments-container");

  if (VIEWED_COMMENTS_ID === imageId) {
    VIEWED_COMMENTS_ID = null;
    existingContainer?.remove();
    cell.classList.remove("open");
    if (currentClickHandler) {
      document.removeEventListener("click", currentClickHandler);
      currentClickHandler = null;
    }
    return;
  }

  if (VIEWED_COMMENTS_ID !== null) {
    const prevCell = document.getElementById(`gallery-image_${VIEWED_COMMENTS_ID}`);
    if (prevCell) {
      prevCell.classList.remove("open");
      prevCell.querySelector(".comments-container")?.remove();
    }
    if (currentClickHandler) {
      document.removeEventListener("click", currentClickHandler);
      currentClickHandler = null;
    }
  }

  VIEWED_COMMENTS_ID = imageId;
  cell.classList.add("open");

  const container = document.createElement("div");
  container.className = "comments-container visible";

  const commentsList = await addCommentsList(imageId);
  container.appendChild(commentsList);

  cell.appendChild(container);

  const handleClickOutside = (e) => {
    if (!container.contains(e.target) && !cell.contains(e.target)) {
      toggleCommentsView(imageId);
    }
  };

  currentClickHandler = handleClickOutside;
  document.addEventListener("click", handleClickOutside);
}

async function toggleLike(imageId) {
  const imageData = ALL_IMAGES.find((image) => image.id === imageId);

  if (!imageData) return;

  playAudio(AUDIO.click);
  const action = imageData.liked_by_me ? removeLike : addLike;

  const res = await action(imageId);

  if (!res.ok) return;

  imageData.liked_by_me = !imageData.liked_by_me;
  imageData.like_count += imageData.liked_by_me ? 1 : -1;

  const cell = document.getElementById(`gallery-image_${imageId}`);
  if (cell) await updateGalleryCell(cell, imageData);
}
