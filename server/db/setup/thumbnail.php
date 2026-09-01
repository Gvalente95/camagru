<?php

$db->exec("
	CREATE TABLE thumbnails (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		filename TEXT NOT NULL UNIQUE,
		user_id INTEGER,
		name TEXT NOT NULL
	)
");

$stmt = $db->prepare("
    INSERT OR IGNORE INTO thumbnails (filename, name)
    VALUES (:filename, :name)
");

for ($i = 0; $i < 9; $i++) {
    $stmt->execute([
        "filename" => "$i.png",
        "name" => "Seed $i",
    ]);
}