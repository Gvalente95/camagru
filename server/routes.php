<?php

function getMe(PDO $db): void
{
    $token = $_COOKIE["session"] ?? null;

    if ($token === null) {
        http_response_code(401);
        return;
    }

    $stmt = $db->prepare("
        SELECT users.id, users.name, users.email
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token = :token
        AND sessions.expires_at > datetime('now')
    ");

    $stmt->execute([
        "token" => $token
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user === false) {
        http_response_code(401);
        return;
    }

    header("Content-Type: application/json");
    echo json_encode($user);
}

function postLogin(PDO $db): void
{
    $body = file_get_contents("php://input");
    $data = json_decode($body, true);

    $name = $data["name"] ?? null;
    $password = $data["password"] ?? null;

    if (!$name || !$password) {
        http_response_code(400);
        return;
    }

    $stmt = $db->prepare("
        SELECT id, name, email, password
        FROM users
        WHERE name = :name
    ");

    $stmt->execute([
        "name" => $name
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user === false) {
        http_response_code(401);
        return;
    }

    if (!password_verify($password, $user["password"])) {
        http_response_code(401);
        return;
    }

    // Create a session token
    $token = bin2hex(random_bytes(32));

    // Store the session
    $stmt = $db->prepare("
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (:user_id, :token, datetime('now', '+7 days'))
    ");

    $stmt->execute([
        "user_id" => $user["id"],
        "token" => $token
    ]);

    // Give the browser the session cookie
    setcookie("session", $token, [
        "expires" => time() + 7 * 24 * 60 * 60,
        "path" => "/",
        "httponly" => true,
        "secure" => true,
        "samesite" => "Lax"
    ]);

    http_response_code(200);
}


function  postSignup(PDO $db): void
{
    $body = file_get_contents("php://input");
    $data = json_decode($body, true);

    $name = $data["name"] ?? null;
    $password = $data["password"] ?? null;
    $email = $data["email"] ?? null;

    if (!$name || !$password || !$email) {
        http_response_code(400);
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

    http_response_code(201);
}