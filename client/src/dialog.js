function initImageDialog() {
  const dialog = document.querySelector(".selected-image-dialog");
  if (dialog) {
    dialog.addEventListener("mousedown", (e) => {
      if (e.target === dialog) dialog.close();
    });
  }
}

function openImageDialog(id) {
  const dialog = document.querySelector(".selected-image-dialog");
  const image = dialog.querySelector(".selected-image");

  image.src = `${API}/images/${id}`;

  dialog.showModal();
}
