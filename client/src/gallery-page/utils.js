function addElement(onclick, imagePath, count) {
  const container = document.createElement("button");
  container.onclick = onclick;
  container.className = "cell-control";

  if (imagePath) {
    const icon = document.createElement("img");
    icon.src = `${ICONS_PATH}${imagePath}`;
    container.appendChild(icon);
  }

  if (count !== null && count !== undefined) {
    const countIcon = document.createElement("div");
    countIcon.textContent = count;
    countIcon.className = "count-icon";
    container.appendChild(countIcon);
  }
  return container;
}