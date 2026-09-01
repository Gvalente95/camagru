<?php

require_once __DIR__ . "/../utils/session.php";

function getUserThumbnails(PDO $db): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    $stmt = $db->prepare("
        SELECT * FROM thumbnails
		WHERE user_id IS NULL OR user_id = :user_id
        ORDER BY id ASC
    ");

	$stmt->execute([
    	"user_id" => $user["id"]
	]);

    $thumbnails = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($thumbnails);
}

function getThumbnailImage(PDO $db, int $thumbnailId): void
{
    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        return;
    }

    $stmt = $db->prepare("
        SELECT *
        FROM thumbnails
        WHERE id = :id
        AND (user_id IS NULL OR user_id = :user_id)
    ");

    $stmt->execute([
        "id" => $thumbnailId,
        "user_id" => $user["id"]
    ]);

    $sticker = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($sticker === false) {
        http_response_code(404);
        return;
    }

    $path = __DIR__ . "/../assets/thumbnails/" . $sticker["filename"];

    if (!is_file($path)) {
        http_response_code(404);
        return;
    }

    header("Content-Type: image/png");
    readfile($path);
}

function deleteThumbnail(PDO $db, int $thumbnailId): void {
	
}