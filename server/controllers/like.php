<?php

function addLike(PDO $db, $imageId){
	header("Content-Type: application/json");

    $user = getUserFromSession($db);
	if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

	$stmt = $db->prepare("
        INSERT INTO image_likes (image_id, user_id)
        VALUES (:image_id, :user_id)
    ");

    $stmt->execute([
        "image_id" => $imageId,
        "user_id" => $user["id"],
    ]);
	http_response_code(201);
}

function removeLike(PDO $db, int $imageId): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    $stmt = $db->prepare("
        DELETE FROM image_likes
        WHERE user_id = :user_id
        AND image_id = :image_id
    ");

    $stmt->execute([
        "user_id" => $user["id"],
        "image_id" => $imageId,
    ]);

    http_response_code(201);


	echo json_encode([
		"image_id" => $imageId,
		"user_id" => $user["id"],
	]);
}
