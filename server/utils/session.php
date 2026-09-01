<?php

function getUserFromSession(PDO $db): ?array
{
    $token = $_COOKIE["session"] ?? null;

    if ($token === null) {
        return null;
    }

    $stmt = $db->prepare("
        SELECT users.id, users.name, users.email, users.dark_mode, users.notify_comment
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
        return null;
    }

    return $user;
}
