<?php


function addComment(PDO $db, $imageId){
    header("Content-Type: application/json");

    $user = getUserFromSession($db);
	if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    $content = file_get_contents("php://input");

    if ($content === false || trim($content) === "") {
        http_response_code(400);
        echo json_encode(["error" => "Comment cannot be empty"]);
        return;
    }

	 $stmt = $db->prepare("
        INSERT INTO image_comments (image_id, user_id, content)
        VALUES (:image_id, :user_id, :content)
    ");

    $stmt->execute([
        "image_id" => $imageId,
        "user_id" => $user["id"],
        "content" => trim($content),
    ]);
	http_response_code(201);

    echo json_encode([
        "id" => $db->lastInsertId(),
    ]);

}

function removeComment(PDO $db, int $commentId): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    $stmt = $db->prepare("
        DELETE FROM image_comments
        WHERE id = :comment_id
        AND user_id = :user_id
    ");

    $stmt->execute([
        "comment_id" => $commentId,
        "user_id" => $user["id"],
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Comment not found"]);
        return;
    }

    http_response_code(204);
}


function getImageComments(PDO $db, int $imageId): void
{
    header("Content-Type: application/json");

    $stmt = $db->prepare("
        SELECT
            image_comments.id,
            image_comments.user_id,
            image_comments.content,
            image_comments.created_at,
            users.name AS username
        FROM image_comments
        JOIN users ON users.id = image_comments.user_id
        WHERE image_comments.image_id = :image_id
        ORDER BY image_comments.created_at ASC
    ");

    $stmt->execute([
        "image_id" => $imageId,
    ]);

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}