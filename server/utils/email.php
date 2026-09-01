<?php

function finalizeEmail(string $payload) : bool{
    $apiKey = getenv("RESEND_API_KEY");
	$ch = curl_init("https://api.resend.com/emails");

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer " . $apiKey,
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $payload
    ]);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);

    error_log("Resend status: " . $status);
    error_log("Resend response: " . $response);
    error_log("Curl error: " . $error);

    return $status >= 200 && $status < 300;
}

function sendVerificationEmail(string $name, string $email, string $token): bool
{
    $verificationUrl =
        "http://localhost:8080/verify-email?token=" . urlencode($token);
    $payload = json_encode([
        "from" => "Camagru <onboarding@resend.dev>",
        "to" => [$email],
        "subject" => "Verify your email",
        "html" =>
            "<span>Welcome </span>" . $name . "<span>! Please verify your email by </span>" .
            "<a href=\"" . htmlspecialchars($verificationUrl) . "\">clicking here</a>"
    ]);
	return finalizeEmail($payload);
}

function sendResetPasswordEmail(string $email, string $token): bool
{
	$resetUrl =
        "http://localhost:4000/?reset-password=" . urlencode($token);
    $payload = json_encode([
        "from" => "Camagru <onboarding@resend.dev>",
        "to" => [$email],
        "subject" => "Reset password",
        "html" =>
            "<a href=\"" . htmlspecialchars($resetUrl) . "\">Click here</a>" . "<span> to reset your password</span>"
    ]);
	return finalizeEmail($payload);
}

function sendEmailChange(string $email, string $name, string $token): bool
{
	$url =
        "http://localhost:8080/change-email?token=" . urlencode($token);
    $payload = json_encode([
        "from" => "Camagru <onboarding@resend.dev>",
        "to" => [$email],
        "subject" => "Confirm this email adress for your Camagru's account.",
        "html" =>
            "<a href=\"" . htmlspecialchars($url) . "\">Click here</a>" . "<span> to set this as the new email adress for your </span>" . $name . "<span> profile.</span>"
    ]);
	return finalizeEmail($payload);
}

function email_already_taken(PDO $db, string $email): bool
{
    $stmt = $db->prepare("
        SELECT 1
        FROM users
        WHERE email = :email
        LIMIT 1
    ");
    $stmt->execute([
        "email" => $email
    ]);
    return $stmt->fetchColumn() !== false;
}