async function updateSideImages() {
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
    btn.onclick = () => openDeleteImageForm(id);

    const delBtnIcon = document.createElement("img");
    delBtnIcon.src = "/assets/icons/delete.png";
    btn.appendChild(delBtnIcon);
    container.appendChild(btn);
    container.appendChild(image);

    side.appendChild(container);
  }

  setClassVisibility("side-label", !CAPTURED_IMAGE_IDS.length);
}
