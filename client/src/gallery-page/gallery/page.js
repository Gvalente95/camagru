async function updatePageCells() {
  const gridElement = document.querySelector(".images-grid");

  const start = CURRENT_PAGE * IMAGES_PER_PAGE;
  const end = start + IMAGES_PER_PAGE;
  const pageIds = new Set(ALL_IMAGES.slice(start, end).map((image) => String(image.id)));

  // Show/hide cells based on current page
  for (const cell of gridElement.querySelectorAll(".cell")) {
    const id = cell.dataset.imageId;
    cell.hidden = !pageIds.has(id);
  }
}

function changePageIndex(idx) {
  if (CURRENT_PAGE === idx) return;
  const imagesLength = ALL_IMAGES.length;

  playAudio(AUDIO.click);
  const maxPage = Math.max(0, Math.ceil(imagesLength / IMAGES_PER_PAGE) - 1);

  CURRENT_PAGE = idx;

  updatePageCells();
  updatePageCellsIndexes();
}

function updatePageCellsIndexes() {
  const pagesAmount = Math.ceil(ALL_IMAGES.length / IMAGES_PER_PAGE);

  const half = Math.floor(MAX_DISLAYED_PAGES / 2);

  let start = Math.max(0, CURRENT_PAGE - half);
  let end = Math.min(pagesAmount, start + MAX_DISLAYED_PAGES);

  start = Math.max(0, end - MAX_DISLAYED_PAGES);

  const gridControl = document.querySelector(".grid-controls");

  document.querySelector(".start-page-button").classList.toggle("invisible", start === 0);
  document.querySelector(".start-ellipsis").classList.toggle("invisible", start === 0);
  document.querySelector(".end-page-button").classList.toggle("invisible", end === pagesAmount);
  document.querySelector(".end-ellipsis").classList.toggle("invisible", end === pagesAmount);

  for (let i = start; i < end; i++) {
    const button = gridControl.children[i - start + 2];

    button.className = `change-page-button${i === CURRENT_PAGE ? " selected" : ""}`;
    button.textContent = i + 1;
    button.onclick = () => changePageIndex(i);
  }
}
