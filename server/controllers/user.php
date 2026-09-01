<?php

require_once __DIR__ . "/../utils/session.php";

function getMe(PDO $db): void
{
    $user = getUserFromSession($db);
    if ($user === null) {
        http_response_code(401);
        return;
    }
    header("Content-Type: application/json");
    echo json_encode($user);
}

function patchMe(PDO $db): void
{
    header("Content-Type: application/json");
    $user = getUserFromSession($db);
    if ($user === null) {
        http_response_code(401);
        return;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $fields = [];
    $params = [
        "id" => $user["id"]
    ];
    if (isset($data["name"])) {
        $fields[] = "name = :name";
        $params["name"] = $data["name"];
    }
	if (isset($data["password"])) {
		$passwordHash = password_hash($data["password"], PASSWORD_DEFAULT);
        $fields[] = "password = :password";
        $params["password"] = $passwordHash;
    }
	if (isset($data["dark_mode"])) {
        $fields[] = "dark_mode = :dark_mode";
        $params["dark_mode"] = $data["dark_mode"];
    }
	if (isset($data["notify_comment"])) {
        $fields[] = "notify_comment = :notify_comment";
        $params["notify_comment"] = $data["notify_comment"];
    }
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode([
            "error" => "No fields to update"
        ]);
        return;
    }
    $stmt = $db->prepare("
        UPDATE users
        SET " . implode(", ", $fields) . "
        WHERE id = :id
    ");
    $stmt->execute($params);
    http_response_code(200);
    echo json_encode([
        "message" => "User updated"
    ]);
}

function patchMyEmail(PDO $db): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);
    if ($user === false) {
        http_response_code(401);
        return;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $fields = [];
    $params = [
        "id" => $user["id"]
    ];

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode([
            "error" => "No fields to update"
        ]);
        return;
    }

	if (isset($data["name"])) {
        $fields[] = "email = :email";
        $params["email"] = $data["email"];
    }

    $stmt = $db->prepare("
        UPDATE users
        SET " . implode(", ", $fields) . "
        WHERE id = :id
    ");

    $stmt->execute($params);

    http_response_code(200);
    echo json_encode([
        "message" => "User updated"
    ]);
}
