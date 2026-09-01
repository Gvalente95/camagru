async function toggleCommentsView(imageId) {
  if (VIEWED_COMMENTS_ID !== null) {
    const cell = document.getElementById(`gallery-image_${VIEWED_COMMENTS_ID}`);
    console.warn("cell:", cell);
    const comments = cell?.querySelector(".comment-list");
    console.warn("comments:", comments);

    comments?.remove();
  }

  if (VIEWED_COMMENTS_ID === imageId) {
    VIEWED_COMMENTS_ID = null;
    return;
  }

  VIEWED_COMMENTS_ID = imageId;

  const cell = document.getElementById(`gallery-image_${imageId}`);

  if (!cell) return;

  const comments = await addCommentsList(imageId);

  cell.appendChild(comments);
}

async function toggleLike(imageId) {
  const imageData = ALL_IMAGES.find((image) => image.id === imageId);

  if (!imageData) return;

  const action = imageData.liked_by_me ? removeLike : addLike;

  const res = await action(imageId);

  if (!res.ok) return;

  imageData.liked_by_me = !imageData.liked_by_me;
  imageData.like_count += imageData.liked_by_me ? 1 : -1;

  const cell = document.getElementById(`gallery-image_${imageId}`);
  if (cell) await updateGalleryCell(cell, imageData);
}
