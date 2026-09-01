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
    await addComment(imageId, content);
    onImagesUpdate();
    commentInput.value = "";
  }

  sendButton.onclick = onSend;

  commentInput.onkeydown = (e) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  commentRow.appendChild(userLabel);
  commentRow.appendChild(commentInput);
  commentRow.appendChild(sendButton);
  return commentRow;
}

async function addCommentsList(imageId) {
  const currentUserId = CURRENT_USER ? CURRENT_USER.id : null;

  const comments = await getComments(imageId);
  const revComments = comments.reverse();
  const commentsList = document.createElement("div");
  commentsList.className = "comment-list";

  if (CURRENT_USER) commentsList.appendChild(addCommentRow(imageId));

  for (const comment of revComments) {
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

    if (comment.user_id === currentUserId) {
      const delDiv = addElement(() => handleRemoveComment(comment.id), "delete.png");
      commentDiv.appendChild(delDiv);
    }
    commentsList.appendChild(commentDiv);
  }

  return commentsList;
}
