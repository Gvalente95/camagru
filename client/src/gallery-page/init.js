async function initGallery() {
  initImageDialog();

  const res = await fetchImages();
  if (res.ok) ALL_IMAGES = await res.json();

  onImageChange();
  await createAllCells();

  initPages();
  updatePageCells();
  updatePageCellsIndexes();
}
