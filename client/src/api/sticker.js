const fetchStickers = async () => {
  try {
    const res = await fetch(`${API}/stickers`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
};

const createSticker = async (image) => {
  const formData = new FormData();
  formData.append("image", image);
  return fetch(`${API}/stickers`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
};

const deleteSticker = async (stickerId) =>
  fetch(`${API}/stickers/${stickerId}`, {
    method: "DELETE",
    credentials: "include",
  });
