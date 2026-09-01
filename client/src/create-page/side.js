async function updateSideImages() {
  async function eraseImage(id) {
    playAudio(AUDIO.delete);
    const res = await deleteImage(id);
    if (res.ok) {
      const idx = CAPTURED_IMAGE_IDS.findIndex((sid) => sid === id);
      CAPTURED_IMAGE_IDS.splice(idx, 1);
      updateSideImages();
    }
  }

  const side = document.querySelector(".side");
  side.replaceChildren();

  const revIds = CAPTURED_IMAGE_IDS.reverse();
  for (const id of revIds) {
    const container = document.createElement("div");
    const image = document.createElement("img");
    const btn = document.createElement("button");

    container.className = "side-image";

    image.src = `${API}/images/${id}`;

    btn.className = "delete-image-button";
    btn.onclick = () => eraseImage(id);

    const delBtnIcon = document.createElement("img");
    delBtnIcon.src = "/assets/icons/delete.png";
    btn.appendChild(delBtnIcon);
    container.appendChild(btn);
    container.appendChild(image);

    side.appendChild(container);
  }

  setClassVisibility("side-label", !CAPTURED_IMAGE_IDS.length);
}
