<?php

require_once __DIR__ . "/controllers/email.php";
require_once __DIR__ . "/controllers/image.php";
require_once __DIR__ . "/controllers/session.php";
require_once __DIR__ . "/controllers/user.php";
require_once __DIR__ . "/controllers/sticker.php";
require_once __DIR__ . "/controllers/comment.php";
require_once __DIR__ . "/controllers/like.php";

function routeRequest(PDO $db): void
{
    $method = $_SERVER["REQUEST_METHOD"];
    $path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

    if ($method === "GET" && $path === "/me") {
        getMe($db);
        return;
    }

    if ($method === "PATCH" && $path === "/me") {
        patchMe($db);
        return;
    }

    if ($method === "POST" && $path === "/login") {
        postLogin($db);
        return;
    }

    if ($method === "POST" && $path === "/signup") {
        postSignup($db);
        return;
    }

    if ($method === "POST" && $path === "/logout") {
        postLogout($db);
        return;
    }

    if ($method === "POST" && $path === "/change-email") {
        sendChangeEmailLink($db);
        return;
    }

    if ($method === "PATCH" && $path === "/my-email") {
        patchMyEmail($db);
        return;
    }

    if ($method === "GET" && $path === "/verify-email") {
        receiveVerificationEmail($db);
        return;
    }

    if ($method === "GET" && $path === "/change-email") {
        receiveChangeEmailConfirmation($db);
        return;
    }

    if ($method === "GET" && $path === "/reset-password") {
        receiveResetPasswordEmail($db);
        return;
    }

    if ($method === "POST" && $path === "/reset-password") {
        resetForgottenPassword($db);
        return;
    }

    if ($method === "POST" && $path === "/forgot-password") {
        sendResetPasswordLink($db);
        return;
    }

    if ($method === "POST" && $path === "/images") {
        createImage($db);
        return;
    }

	if ($method === 'GET' && $path === '/stickers'){
		getUserThumbnails($db);
		return;
	}

    if ($method === "GET" && $path === "/images") {
        getImages($db);
        return;
    }

    if (preg_match('#^/images/(\d+)$#', $path, $matches)) {
        $imageId = (int) $matches[1];

        if ($method === "GET") {
            getImage($db, $imageId);
            return;
        }

        if ($method === "DELETE") {
            deleteImage($db, $imageId);
            return;
        }
    }

	if (preg_match('#^/likes/(\d+)$#', $path, $matches)) {
        $imageId = (int) $matches[1];
        if ($method === "POST") {
            addLike($db, $imageId);
            return;
        }
        if ($method === "DELETE") {
            removeLike($db, $imageId);
            return;
        }
    }

	if (preg_match('#^/comments/(\d+)$#', $path, $matches)) {
        $targetId = (int) $matches[1];

        if ($method === "POST") {
            addComment($db, $targetId);
            return;
        }

        if ($method === "DELETE") {
            removeComment($db, $targetId);
            return;
        }
    }

	if (preg_match('#^/images/(\d+)/comments$#', $path, $matches)) {
		if ($method === "GET") {
			$imageId = (int) $matches[1];
			getImageComments($db, $imageId);
			return;
		}
	}


    if (preg_match('#^/sticker/(\d+)$#', $path, $matches)) {
        $stickerId = (int) $matches[1];

        if ($method === "GET") {
            getThumbnailImage($db, $stickerId);
            return;
        }

        if ($method === "DELETE") {
            deleteThumbnail($db, $stickerId);
            return;
        }
    }

    http_response_code(404);
    echo json_encode(["error" => "Route not found"]);
}