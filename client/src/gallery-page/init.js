async function initGallery() {
  const res = await fetchImages();
  if (res.ok) ALL_IMAGES = await res.json();
  changePage(0);
}
