async function updateSideImages() {
  const side = document.querySelector(".side");
  side.replaceChildren();

  const revIds = CAPTURED_IMAGE_IDS.reverse();
  for (const id of revIds) {
    const container = document.createElement("div");
    const image = document.createElement("img");
    const delBtn = document.createElement("button");

    container.className = "side-image";

    image.src = `${API}/images/${id}`;
    image.onclick = () => openImageDialog(id);

    delBtn.className = "delete-image-button";
    delBtn.onclick = () => openDeleteImageForm(id);

    const delBtnIcon = document.createElement("img");
    delBtnIcon.src = "/assets/icons/delete.svg";
    delBtn.appendChild(delBtnIcon);
    container.appendChild(delBtn);
    container.appendChild(image);

    side.appendChild(container);
  }

  setClassVisibility("side-label", !CAPTURED_IMAGE_IDS.length);
}
