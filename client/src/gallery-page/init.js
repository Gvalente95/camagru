async function initGallery() {
  const res = await fetchImages();
  if (res.ok) ALL_IMAGES = await res.json();

  onImageChange();

  // Create all cells upfront
  await createAllCells();

  initPages();
  updatePageCells();
  updatePageCellsIndexes();
}

async function createAllCells() {
  const gridElement = document.querySelector(".images-grid");
  gridElement.replaceChildren();

  for (const image of ALL_IMAGES) {
    const isMine = CURRENT_USER && image.user_id === CURRENT_USER.id;
    const cell = createGalleryCell(image.id, isMine);
    gridElement.appendChild(cell);
    await updateGalleryCell(cell, image);
  }

  setImageRatios();
}

function initPages() {
  const pagesAmount = Math.ceil(ALL_IMAGES.length / IMAGES_PER_PAGE);

  const displayedPages = Math.min(pagesAmount, MAX_DISLAYED_PAGES);

  const gridControl = document.querySelector(".grid-controls");

  const startButton = document.createElement("button");
  startButton.className = "start-page-button";
  startButton.onclick = () => changePageIndex(Math.max(0, CURRENT_PAGE - MAX_DISLAYED_PAGES));
  startButton.textContent = "<";
  gridControl.appendChild(startButton);

  const startEllipsis = document.createElement("span");
  startEllipsis.className = "page-ellipsis start-ellipsis";
  startEllipsis.textContent = "…";
  gridControl.appendChild(startEllipsis);

  for (let i = 0; i < displayedPages; i++) {
    const el = document.createElement("button");
    el.className = "change-page-button";
    el.onclick = () => changePageIndex(i);
    gridControl.appendChild(el);
  }

  const endEllipsis = document.createElement("span");
  endEllipsis.className = "page-ellipsis end-ellipsis";
  endEllipsis.textContent = "…";
  gridControl.appendChild(endEllipsis);

  const endButton = document.createElement("button");
  endButton.className = "end-page-button";
  endButton.onclick = () => changePageIndex(Math.min(CURRENT_PAGE + MAX_DISLAYED_PAGES, pagesAmount - 1));
  endButton.textContent = ">";
  gridControl.appendChild(endButton);

  updatePageCellsIndexes();
}
