<?php

require_once __DIR__ . "/../utils/session.php";

function getUserStickers(PDO $db): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    $stmt = $db->prepare("
        SELECT * FROM stickers
		WHERE user_id IS NULL OR user_id = :user_id
		ORDER BY user_id IS NOT NULL DESC, id DESC
    ");

	$stmt->execute([
    	"user_id" => $user["id"]
	]);

    $stickers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($stickers);
}

function getStickerImage(PDO $db, int $stickerId): void
{
    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        return;
    }

    $stmt = $db->prepare("
        SELECT *
        FROM stickers
        WHERE id = :id
        AND (user_id IS NULL OR user_id = :user_id)
    ");

    $stmt->execute([
        "id" => $stickerId,
        "user_id" => $user["id"]
    ]);

    $sticker = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($sticker === false) {
        http_response_code(404);
        return;
    }

    $path = __DIR__ . "/../assets/stickers/" . $sticker["filename"];

    if (!is_file($path)) {
        http_response_code(404);
        return;
    }

    header("Content-Type: image/png");
    readfile($path);
}

function deleteSticker(PDO $db, int $stickerId): void {
    header("Content-Type: application/json");

    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    $stmt = $db->prepare("
        SELECT filename
        FROM stickers
        WHERE id = :id AND user_id = :user_id
    ");

    $stmt->execute([
        "id" => $stickerId,
        "user_id" => $user["id"],
    ]);

    $sticker = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sticker) {
        http_response_code(404);
        echo json_encode(["error" => "Sticker not found"]);
        return;
    }

    $path = __DIR__ . "/../assets/stickers/" . $sticker["filename"];

    $stmt = $db->prepare("
        DELETE FROM stickers
        WHERE id = :id AND user_id = :user_id
    ");

    $stmt->execute([
        "id" => $stickerId,
        "user_id" => $user["id"],
    ]);

    if (file_exists($path)) {
        unlink($path);
    }

    http_response_code(204);
}

function createUserSticker(PDO $db): void {
    header("Content-Type: application/json");

    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    if (!isset($_FILES["image"])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing image"]);
        return;
    }

    $image = $_FILES["image"];

    if ($image["error"] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["error" => "Upload failed"]);
        return;
    }

    $mime = mime_content_type($image["tmp_name"]);

    $extensions = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp",
    ];

    if (!isset($extensions[$mime])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid image type"]);
        return;
    }

    $extension = $extensions[$mime];
    $filename = bin2hex(random_bytes(16)) . "." . $extension;
    $name = pathinfo($image["name"], PATHINFO_FILENAME);

    $directory = __DIR__ . "/../assets/stickers";
    $path = $directory . "/" . $filename;

    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    if (!move_uploaded_file($image["tmp_name"], $path)) {
        http_response_code(500);
        echo json_encode(["error" => "Could not save sticker"]);
        return;
    }

    try {
        $stmt = $db->prepare("
            INSERT INTO stickers (user_id, filename, name)
            VALUES (:user_id, :filename, :name)
        ");

        $stmt->execute([
            "user_id" => $user["id"],
            "filename" => $filename,
            "name" => $name,
        ]);
    } catch (Throwable $e) {
        if (file_exists($path)) {
            unlink($path);
        }

        http_response_code(500);
        echo json_encode(["error" => "Could not create sticker"]);
        return;
    }

    http_response_code(201);

    echo json_encode([
        "id" => $db->lastInsertId(),
        "filename" => $filename,
        "name" => $name,
    ]);
}