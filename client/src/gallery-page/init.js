async function initGallery() {
  const res = await fetchImages();
  if (res.ok) ALL_IMAGES = await res.json();

  onImageChange();
  await createAllCells();

  initPages();
  updatePageCells();
  updatePageCellsIndexes();

  const dialog = document.querySelector(".selected-cell");
  dialog.addEventListener("mousedown", (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });
}
