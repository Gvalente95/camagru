const getComments = async (imageId) => {
  const res = await fetch(`${API}/images/${imageId}/comments`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    return [];
  }

  return await res.json();
};

const addComment = async (imageId, comment) => {
  return fetch(`${API}/comments/${imageId}`, {
    method: "POST",
    credentials: "include",
    body: comment,
  });
};

const removeComment = async (commentId) => {
  return fetch(`${API}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
};
