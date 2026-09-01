async function updateGalleryPage() {
  const gridElement = document.querySelector(".images-grid");

  const start = CURRENT_PAGE * IMAGES_PER_PAGE;
  const end = start + IMAGES_PER_PAGE;
  const pageImages = ALL_IMAGES.slice(start, end);

  const pageIds = new Set(pageImages.map((image) => String(image.id)));

  for (const cell of gridElement.querySelectorAll(".cell")) {
    const id = cell.dataset.imageId;

    if (!pageIds.has(id)) {
      cell.remove();
    }
  }

  for (const image of pageImages) {
    let cell = document.getElementById(`gallery-image_${image.id}`);

    if (!cell) {
      cell = createGalleryCell(image.id);
      gridElement.appendChild(cell);
    }

    await updateGalleryCell(cell, image);
  }

  setImageRatios();
}

function changePage(direction) {
  const imagesLength = ALL_IMAGES.length;

  const maxPage = Math.max(0, Math.ceil(imagesLength / IMAGES_PER_PAGE) - 1);

  CURRENT_PAGE = Math.max(0, Math.min(CURRENT_PAGE + direction, maxPage));

  document.querySelector(".page-button").disabled = CURRENT_PAGE === 0;
  document.querySelector(".page-button.right").disabled = CURRENT_PAGE >= maxPage;

  const first = CURRENT_PAGE * IMAGES_PER_PAGE + 1;

  const last = Math.min(imagesLength, first + IMAGES_PER_PAGE - 1);

  document.querySelector(".page-info-label").textContent = imagesLength ? `${first}-${last}/${imagesLength}` : "0/0";
  document.querySelector(".page-index-label").textContent = CURRENT_PAGE + 1;

  updateGalleryPage();
}
