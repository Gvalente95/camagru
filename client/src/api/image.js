async function createImage(background, stickerId, placement) {
  const formData = new FormData();
  formData.append("background", background, "background.png");
  formData.append("sticker_id", stickerId);
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
