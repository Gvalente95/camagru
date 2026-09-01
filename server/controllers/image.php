<?php

require_once __DIR__ . "/../utils/image.php";
require_once __DIR__ . "/../utils/session.php";

function createImage(PDO $db): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    if (!isset($_FILES["background"])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing background"]);
        return;
    }

    if (!isset($_POST["thumbnail_id"])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing thumbnail_id"]);
        return;
    }

    if (!isset($_POST["placement"])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing placement"]);
        return;
    }

    $bg = $_FILES["background"];
    $thumbnailId = (int) $_POST["thumbnail_id"];
    $placementRaw = $_POST["placement"];

    $placement = json_decode($placementRaw, true);

    if (!is_array($placement)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid placement"]);
        return;
    }

    if (!$thumbnailId) {
        http_response_code(400);
        echo json_encode(["error" => "Missing Thumbnail"]);
        return;
    }

    if ($bg["error"] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["error" => "Background upload failed"]);
        return;
    }

    $bgMime = mime_content_type($bg["tmp_name"]);

    if (!in_array($bgMime, ["image/png", "image/jpeg"], true)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid background type"]);
        return;
    }

    $stmt = $db->prepare("
        SELECT filename
        FROM thumbnails
        WHERE id = :id
        AND (user_id IS NULL OR user_id = :user_id)
    ");

    $stmt->execute([
        "id" => $thumbnailId,
        "user_id" => $user["id"],
    ]);

    $thumbnail = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($thumbnail === false) {
        http_response_code(404);
        echo json_encode(["error" => "Thumbnail not found"]);
        return;
    }

    $overlayPath = __DIR__ . "/../assets/thumbnails/" . $thumbnail["filename"];

    if (!is_file($overlayPath)) {
        http_response_code(404);
        echo json_encode(["error" => "Thumbnail file not found"]);
        return;
    }

    $overlayMime = mime_content_type($overlayPath);

    if ($overlayMime !== "image/png") {
        http_response_code(500);
        echo json_encode(["error" => "Invalid thumbnail file"]);
        return;
    }

    $filename = bin2hex(random_bytes(16)) . ".png";
    $uploadDir = __DIR__ . "/../uploads/";
    $destination = $uploadDir . $filename;

    $success = createFinalImage(
        $bg["tmp_name"],
        $overlayPath,
        $destination,
        $placement
    );

    if (!$success) {
        http_response_code(500);
        echo json_encode(["error" => "Could not create image"]);
        return;
    }

    $stmt = $db->prepare("
        INSERT INTO images (user_id, filename, mime_type)
        VALUES (:user_id, :filename, :mime_type)
    ");

    $stmt->execute([
        "user_id" => $user["id"],
        "filename" => $filename,
        "mime_type" => "image/png",
    ]);

    http_response_code(201);

    echo json_encode([
        "id" => $db->lastInsertId(),
        "filename" => $filename,
        "url" => "/uploads/" . $filename,
    ]);
}

function getImages(PDO $db): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);
    $userId = $user["id"] ?? null;

    $stmt = $db->prepare("
        SELECT
            images.id,
            images.user_id,
            images.filename,
            images.created_at,
            users.name AS username,

            (
                SELECT COUNT(*)
                FROM image_likes
                WHERE image_likes.image_id = images.id
            ) AS like_count,

            (
                SELECT COUNT(*)
                FROM image_comments
                WHERE image_comments.image_id = images.id
            ) AS comment_count,

            CASE
                WHEN EXISTS (
                    SELECT 1
                    FROM image_likes
                    WHERE image_likes.image_id = images.id
                    AND image_likes.user_id = :current_user_id
                )
                THEN 1
                ELSE 0
            END AS liked_by_me

        FROM images
        JOIN users ON users.id = images.user_id
        ORDER BY images.created_at DESC
    ");

    $stmt->execute([
        "current_user_id" => $userId,
    ]);

    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($images as &$image) {
		$image["url"] = "/uploads/" . $image["filename"];
		$image["liked_by_me"] = (bool) $image["liked_by_me"];
		$image["like_count"] = (int) $image["like_count"];
		$image["comment_count"] = (int) $image["comment_count"];
	}

    echo json_encode($images);
}

function getImage(PDO $db, int $imageId): void
{
    $stmt = $db->prepare("
        SELECT filename, mime_type
        FROM images
        WHERE id = :id
    ");

    $stmt->execute(["id" => $imageId]);

    $image = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($image === false) {
        http_response_code(404);
        return;
    }

    $path = __DIR__ . "/../uploads/" . $image["filename"];

    if (!is_file($path)) {
        http_response_code(404);
        return;
    }

    header("Content-Type: " . $image["mime_type"]);
    header("Content-Length: " . filesize($path));

    readfile($path);
}

function deleteImage(PDO $db, int $imageId): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    $stmt = $db->prepare("
        SELECT filename, user_id
        FROM images
        WHERE id = :id
    ");

    $stmt->execute(["id" => $imageId]);
    $image = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($image === false) {
        http_response_code(404);
        echo json_encode(["error" => "Image not found"]);
        return;
    }

    if ((int) $image["user_id"] !== (int) $user["id"]) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        return;
    }

    $path = __DIR__ . "/../uploads/" . $image["filename"];

    if (is_file($path)) {
        unlink($path);
    }

    $stmt = $db->prepare("
        DELETE FROM images
        WHERE id = :id
    ");

    $stmt->execute(["id" => $imageId]);

    http_response_code(200);
    echo json_encode(["message" => "Image deleted"]);
}
