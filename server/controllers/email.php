<?php

require_once __DIR__ . "/../utils/email.php";
require_once __DIR__ . "/../utils/session.php";

function receiveVerificationEmail(PDO $db): void
{
    $token = $_GET["token"] ?? null;

    if (!$token) {
        header("Location: http://localhost:4000/?verify-email=invalid");
        exit;
    }

    $tokenHash = hash("sha256", $token);

    $stmt = $db->prepare("
        SELECT user_id
        FROM email_verifications
        WHERE token_hash = :token_hash
        AND expires_at > datetime('now')
    ");

    $stmt->execute([
        "token_hash" => $tokenHash
    ]);

    $verification = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($verification === false) {
        header("Location: http://localhost:4000/?verify-email=invalid");
        exit;
    }

    $db->prepare("
        UPDATE users
        SET email_verified = 1
        WHERE id = :id
    ")->execute([
        "id" => $verification["user_id"]
    ]);

    $db->prepare("
        DELETE FROM email_verifications
        WHERE user_id = :user_id
    ")->execute([
        "user_id" => $verification["user_id"]
    ]);

    header("Location: http://localhost:4000/?verify-email=success");
    exit;
}

function receiveResetPasswordEmail(PDO $db): void
{
    $token = $_GET["token"] ?? null;

    if (!$token) {
        header("Location: http://localhost:4000/?password-reset=invalid");
        exit;
    }

    $tokenHash = hash("sha256", $token);

    $stmt = $db->prepare("
        SELECT user_id
        FROM email_verifications
        WHERE token_hash = :token_hash
        AND expires_at > datetime('now')
    ");

    $stmt->execute([
        "token_hash" => $tokenHash
    ]);

    $verification = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($verification === false) {
        header("Location: http://localhost:4000/?password-reset=invalid");
        exit;
    }

    $db->prepare("
        UPDATE users
        SET email_verified = 1
        WHERE id = :id
    ")->execute([
        "id" => $verification["user_id"]
    ]);

    $db->prepare("
        DELETE FROM email_verifications
        WHERE user_id = :user_id
    ")->execute([
        "user_id" => $verification["user_id"]
    ]);

    header("Location: http://localhost:4000/?password-reset=success");
    exit;
}

function receiveChangeEmailConfirmation(PDO $db): void
{
    $token = $_GET["token"] ?? null;

    if (!$token) {
        header("Location: http://localhost:4000/account?change-email=invalid");
        exit;
    }

    $tokenHash = hash("sha256", $token);

    $stmt = $db->prepare("
        SELECT user_id, new_email
        FROM email_change_verifications
        WHERE token_hash = :token_hash
        AND expires_at > datetime('now')
    ");

    $stmt->execute([
        "token_hash" => $tokenHash
    ]);

    $verification = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($verification === false) {
        header("Location: http://localhost:4000/?change-email=invalid");
        exit;
    }

    $db->prepare("
        UPDATE users
        SET email = :email
        WHERE id = :id
    ")->execute([
        "email" => $verification["new_email"],
        "id" => $verification["user_id"]
    ]);

    $db->prepare("
        DELETE FROM email_change_verifications
        WHERE user_id = :user_id
    ")->execute([
        "user_id" => $verification["user_id"]
    ]);

    header("Location: http://localhost:4000/account?change-email=success");
    exit;
}

function sendResetPasswordLink(PDO $db): void
{
    header("Content-Type: application/json");

    $body = file_get_contents("php://input");
    $data = json_decode($body, true);

    $email = $data["email"] ?? null;
    if (!$email) {
        http_response_code(400);
        echo json_encode(["error" => "Missing email"]);
        return;
    }

	$name = $data["name"] ?? null;
	if (!$name) {
        http_response_code(400);
        echo json_encode(["error" => "Missing name"]);
        return;
    }

    $stmt = $db->prepare("
        SELECT id
        FROM users
        WHERE email = :email AND name = :name
    ");

    $stmt->execute([
        "email" => $email,
		"name" => $name
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user === false) {
        http_response_code(404);
        echo json_encode([
            "error" => "User not found"
        ]);
        return;
    }

    $db->prepare("
        DELETE FROM password_resets
        WHERE user_id = :user_id
    ")->execute([
        "user_id" => $user["id"]
    ]);

    $token = bin2hex(random_bytes(32));
    $tokenHash = hash("sha256", $token);

    $stmt = $db->prepare("
        INSERT INTO password_resets (user_id, token_hash, expires_at)
        VALUES (:user_id, :token_hash, datetime('now', '+1 hour'))
    ");

    $stmt->execute([
        "user_id" => $user["id"],
        "token_hash" => $tokenHash
    ]);

    if (!sendResetPasswordEmail($email, $token)) {
        http_response_code(500);
        echo json_encode([
            "error" => "Could not send reset password email"
        ]);
        return;
    }

    http_response_code(200);
    echo json_encode([
        "message" => "Reset password email sent"
    ]);
}

function sendChangeEmailLink(PDO $db): void
{
    header("Content-Type: application/json");

    $user = getUserFromSession($db);
    if ($user === null) {
        http_response_code(401);
		echo json_encode(["error" => "Unauthorized"]);
        return;
    }

    $body = file_get_contents("php://input");
    $data = json_decode($body, true);

    $new_email = $data["new_email"] ?? null;
	$name = $user["name"];

    if (!$new_email || !$name) {
        http_response_code(400);
        echo json_encode(["error" => "Missing credentials"]);
        return;
    }

	if (!filter_var($new_email, FILTER_VALIDATE_EMAIL)) {
		http_response_code(400);
		echo json_encode(["error" => "Invalid email"]);
		return;
	}
	if (email_already_taken($db, $new_email)){
		http_response_code(409);
    	echo json_encode(["error" => "Email already in use"]);
		return;
	}

    $db->prepare("
        DELETE FROM email_change_verifications
        WHERE user_id = :user_id
    ")->execute([
        "user_id" => $user["id"],
    ]);

    $token = bin2hex(random_bytes(32));
    $tokenHash = hash("sha256", $token);

    $stmt = $db->prepare("
        INSERT INTO email_change_verifications (user_id, token_hash, expires_at, new_email)
        VALUES (:user_id, :token_hash, datetime('now', '+1 hour'), :new_email)
    ");

	

    $stmt->execute([
        "user_id" => $user["id"],
        "token_hash" => $tokenHash,
		"new_email" => $new_email
    ]);

    if (!sendEmailChange($new_email, $name, $token)) {
        http_response_code(500);
        echo json_encode([
            "error" => "Could not send the request to the new email address"
        ]);
        return;
    }

    http_response_code(200);
    echo json_encode([
        "message" => "Request successfully sent to the new email address"
    ]);
}

function resetForgottenPassword(PDO $db): void
{
    header("Content-Type: application/json");

    $data = json_decode(file_get_contents("php://input"), true);

    $token = $data["token"] ?? null;
    $password = $data["password"] ?? null;

    if (!$token) {
        http_response_code(400);
        echo json_encode([
            "error" => "No token provided"
        ]);
        return;
    }

    if (!$password) {
        http_response_code(400);
        echo json_encode([
            "error" => "No password provided"
        ]);
        return;
    }

    $tokenHash = hash("sha256", $token);

    $stmt = $db->prepare("
        SELECT user_id
        FROM password_resets
        WHERE token_hash = :token_hash
        AND expires_at > datetime('now')
    ");

    $stmt->execute([
        "token_hash" => $tokenHash
    ]);

    $reset = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($reset === false) {
        http_response_code(400);
        echo json_encode([
            "error" => "Reset link is invalid or expired"
        ]);
        return;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare("
        UPDATE users
        SET password = :password
        WHERE id = :user_id
    ");

    $stmt->execute([
        "password" => $passwordHash,
        "user_id" => $reset["user_id"]
    ]);

    $db->prepare("
        DELETE FROM password_resets
        WHERE user_id = :user_id
    ")->execute([
        "user_id" => $reset["user_id"]
    ]);

    $db->prepare("
        DELETE FROM sessions
        WHERE user_id = :user_id
    ")->execute([
        "user_id" => $reset["user_id"]
    ]);

    http_response_code(200);
    echo json_encode([
        "message" => "Password reset successfully"
    ]);
}
