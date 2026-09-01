const addLike = async (imageId) => {
  return fetch(`${API}/likes/${imageId}`, {
    method: "POST",
    credentials: "include",
  });
};

const removeLike = async (imageId) => {
  return fetch(`${API}/likes/${imageId}`, {
    method: "DELETE",
    credentials: "include",
  });
};
