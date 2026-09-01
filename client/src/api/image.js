const fetchThumbnails = async () => {
  try {
    const res = await fetch(`${API}/thumbnails`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
};

async function createImage(background, thumbnailId, placement) {
  const formData = new FormData();
  formData.append("background", background, "background.png");
  formData.append("thumbnail_id", thumbnailId);
  formData.append("placement", JSON.stringify(getOverlayPlacement()));

  return await fetch(`${API}/images`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
}

const deleteImage = async (imageId) => {
  return fetch(`${API}/images/${imageId}`, {
    method: "DELETE",
    credentials: "include",
  });
};

const fetchImages = async () => {
  return fetch(`${API}/images`, {
    method: "GET",
    credentials: "include",
  });
};
