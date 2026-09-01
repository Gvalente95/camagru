<?php

function postLogin(PDO $db): void
{
    $body = file_get_contents("php://input");
    $data = json_decode($body, true);

    $name = $data["name"] ?? null;
    $password = $data["password"] ?? null;

    header("Content-Type: application/json");

    if (!$name || !$password) {
        http_response_code(400);
        echo json_encode(["error" => "Missing username or password"]);
        return;
    }

    $stmt = $db->prepare("
        SELECT id, name, email, password, email_verified
        FROM users
        WHERE name = :name
    ");

    $stmt->execute([
        "name" => $name
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user === false || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode(["error" => "Wrong username or password"]);
        return;
    }

	if (!$user["email_verified"]) {
		http_response_code(403);
		echo json_encode(["error" => "Please verify your email before logging in"]);
		return;
	}

    $token = bin2hex(random_bytes(32));

    $stmt = $db->prepare("
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (:user_id, :token, datetime('now', '+7 days'))
    ");

    $stmt->execute([
        "user_id" => $user["id"],
        "token" => $token
    ]);

    setcookie("session", $token, [
        "expires" => time() + 7 * 24 * 60 * 60,
        "path" => "/",
        "httponly" => true,
        "secure" => false,
        "samesite" => "Lax"
    ]);

    http_response_code(200);

    echo json_encode([
        "message" => "Login successful",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"]
        ]
    ]);
}

function postSignup(PDO $db): void
{
	header("Content-Type: application/json");

    $body = file_get_contents("php://input");
    $data = json_decode($body, true);

    $name = $data["name"] ?? null;
    $password = $data["password"] ?? null;
    $email = $data["email"] ?? null;


    if (!$name || !$password || !$email) {
        http_response_code(400);
        echo json_encode(["error" => "Missing credentials"]);
        return;
    }

    $stmt = $db->prepare("
        SELECT id
        FROM users
        WHERE name = :name OR email = :email
    ");

    $stmt->execute([
        "name" => $name,
        "email" => $email
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user !== false) {
		http_response_code(409);
		echo json_encode([
			"error" => "Username or email already exists"
		]);
		return;
	}

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare("
        INSERT INTO users (name, email, password)
        VALUES (:name, :email, :password)
    ");

    $stmt->execute([
        "name" => $name,
        "email" => $email,
        "password" => $passwordHash
    ]);

	$userId = $db->lastInsertId();

	$token = bin2hex(random_bytes(32));
	$tokenHash = hash("sha256", $token);

	$stmt = $db->prepare("
		INSERT INTO email_verifications (user_id, token_hash, expires_at)
		VALUES (:user_id, :token_hash, datetime('now', '+1 hour'))
	");

	$stmt->execute([
		"user_id" => $userId,
		"token_hash" => $tokenHash
	]);

	sendVerificationEmail($name, $email, $token);

    http_response_code(201);
}

function postLogout(PDO $db): void
{
    $token = $_COOKIE["session"] ?? null;

    if ($token) {
        $stmt = $db->prepare("
            DELETE FROM sessions
            WHERE token = :token
        ");

        $stmt->execute([
            "token" => $token
        ]);
    }

    setcookie("session", "", [
        "expires" => time() - 3600,
        "path" => "/",
        "httponly" => true,
        "secure" => false,
        "samesite" => "Lax"
    ]);

    http_response_code(200);
    header("Content-Type: application/json");

    echo json_encode([
        "message" => "Logged out"
    ]);
}
