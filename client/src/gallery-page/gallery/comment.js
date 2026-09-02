function createCommentElement(comment, imageId) {
  const currentUserId = CURRENT_USER ? CURRENT_USER.id : null;

  const commentDiv = document.createElement("div");
  commentDiv.className = "comment";

  const textDiv = document.createElement("div");

  const usernameEl = document.createElement("strong");
  usernameEl.textContent = comment.username;
  usernameEl.className = "comment-username";

  const contentEl = document.createElement("span");
  contentEl.textContent = ` ${comment.content}`;

  textDiv.appendChild(usernameEl);
  textDiv.appendChild(contentEl);
  commentDiv.appendChild(textDiv);

  return commentDiv;
}

function addCommentRow(imageId) {
  const commentRow = document.createElement("div");
  commentRow.className = "comment-input-row";

  const userLabel = document.createElement("span");
  userLabel.className = "comment-user-label";
  userLabel.textContent = CURRENT_USER?.name ?? "Guest";

  const commentInput = document.createElement("input");
  commentInput.className = "comment-input";
  commentInput.type = "text";
  commentInput.placeholder = "Add a comment...";

  const sendButton = document.createElement("button");
  sendButton.className = "comment-send-button";

  const sendIcon = document.createElement("img");
  sendIcon.src = `${ICONS_PATH}send-icon.svg`;

  sendButton.appendChild(sendIcon);

  async function onSend() {
    const content = commentInput.value.trim();
    if (!content) return;

    playAudio(AUDIO.send);
    sendButton.classList.remove("active");

    const res = await addComment(imageId, content);
    if (res.ok) {
      const data = await res.json();

      const comment = {
        id: data.id,
        user_id: CURRENT_USER.id,
        username: CURRENT_USER.name,
        content,
      };

      const imageData = ALL_IMAGES.find((img) => img.id === imageId);

      if (imageData) {
        imageData.comment_count += 1;

        const cell = document.getElementById(`gallery-image_${imageId}`);
        const countIcons = cell?.querySelectorAll(".count-icon");

        countIcons?.forEach((countIcon, index) => {
          if (index === 1) {
            countIcon.textContent = imageData.comment_count;
          }
        });
      }

      const cell = document.getElementById(`gallery-image_${imageId}`);
      const commentsList = cell?.querySelector(".comment-list");

      if (commentsList) {
        const commentEl = createCommentElement(comment, imageId);
        const inputRow = commentsList.querySelector(".comment-input-row");

        inputRow?.insertAdjacentElement("afterend", commentEl);
      }

      commentInput.value = "";
      commentInput.focus();
    }
  }

  sendButton.onclick = onSend;

  commentInput.oninput = () => {
    sendButton.classList.toggle("active", commentInput.value.length > 0);
  };

  commentInput.onkeydown = (e) => {
    if (e.key === "Enter") onSend();
  };

  commentRow.appendChild(userLabel);
  commentRow.appendChild(commentInput);
  commentRow.appendChild(sendButton);
  return commentRow;
}

async function addCommentsList(imageId) {
  const comments = await getComments(imageId);
  const commentsList = document.createElement("div");
  commentsList.className = "comment-list";

  if (CURRENT_USER) {
    commentsList.appendChild(addCommentRow(imageId));
  }

  for (const comment of comments.reverse()) {
    commentsList.appendChild(createCommentElement(comment, imageId));
  }

  return commentsList;
}
