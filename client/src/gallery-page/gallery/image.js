async function onImagesUpdate() {
  const res = await fetchImages();
  if (res.ok) ALL_IMAGES = await res.json();
  onImageChange();

  const maxPage = Math.max(0, Math.ceil(ALL_IMAGES.length / IMAGES_PER_PAGE) - 1);
  if (CURRENT_PAGE > maxPage) CURRENT_PAGE = maxPage;
}

function setImageRatios() {
  document.querySelectorAll(".cell img").forEach((img) => {
    const imageContainer = img.closest(".cell-image-container");
    if (!imageContainer) {
      return;
    }

    if (!imageContainer.style.getPropertyValue("--image-ratio")) {
      imageContainer.style.setProperty("--image-ratio", "1");
    }

    const setRatio = () => {
      try {
        const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        imageContainer.style.setProperty("--image-ratio", String(ratio));
      } catch (e) {}
    };
    if (img.complete) {
      setRatio();
    } else {
      img.addEventListener("load", setRatio, { once: true });
      img.addEventListener("error", () => setRatio(), { once: true });
    }
  });
}

function onImageChange() {
  setClassVisibility("grid-controls", ALL_IMAGES.length > 0);
  setClassVisibility("empty-gallery-label", ALL_IMAGES.length === 0);
}
