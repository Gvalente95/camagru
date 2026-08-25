<?php

require_once __DIR__ . "/../routes.php";
require_once __DIR__ . "/../data/database.php";

header("Access-Control-Allow-Origin: http://localhost:4000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$stmt = $db->prepare("SELECT * FROM users");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($method === "GET" && $path === "/me") {
    getMe($db);
    exit;
}

if ($method === "POST" && $path === "/login") {
    postLogin($db);
    exit;
}

if ($method === "POST" && $path === "/signup") {
    postSignup($db);
    exit;
}

http_response_code(404);
