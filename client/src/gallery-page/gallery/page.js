async function updatePageCells() {
  const gridElement = document.querySelector(".images-grid");

  const start = CURRENT_PAGE * IMAGES_PER_PAGE;
  const end = start + IMAGES_PER_PAGE;
  const pageIds = new Set(ALL_IMAGES.slice(start, end).map((image) => String(image.id)));

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

function initPages() {
  const pagesAmount = Math.ceil(ALL_IMAGES.length / IMAGES_PER_PAGE);

  const displayedPages = Math.min(pagesAmount, MAX_DISLAYED_PAGES);

  const gridControl = document.querySelector(".grid-controls");

  if (pagesAmount === 1) gridControl.style.opacity = 0;

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
