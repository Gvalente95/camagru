async function handleDeleteImage(imageId) {
  const res = await deleteImage(imageId);

  if (!res.ok) return;

  document.getElementById(`gallery-image_${imageId}`)?.remove();

  await onImagesUpdate();
}

function setImageRatios() {
  document.querySelectorAll(".cell img").forEach((img) => {
    const cell = img.closest(".cell");
    if (!cell) return;
    const setRatio = () => {
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
      cell.style.setProperty("--image-ratio", String(ratio));
    };
    if (img.complete) setRatio();
    else img.addEventListener("load", setRatio, { once: true });
  });
}
