<?php

$db->exec("
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
    	email_verified INTEGER NOT NULL DEFAULT 0,
        dark_mode INTEGER NOT NULL DEFAULT 0,
		notify_comment INTEGER NOT NULL DEFAULT 0
    )
");

$passwordHash = password_hash("pass", PASSWORD_DEFAULT);

$n = 20;

$stmt = $db->prepare("
    INSERT INTO users (name, email, password, email_verified)
    VALUES (:name, :email, :password, :email_verified)
");

for ($i = 1; $i <= $n; $i++) {
    $stmt->execute([
        "name" => "user$i",
        "email" => "user$i@example.com",
        "password" => $passwordHash,
        "email_verified" => 1,
    ]);
}