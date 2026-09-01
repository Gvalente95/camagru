<?php

function createFinalImage(
    string $backgroundPath,
    string $overlayPath,
    string $destination,
    ?array $placement = null
): bool {
    $background = imagecreatefromstring(file_get_contents($backgroundPath));
    $overlay = imagecreatefromstring(file_get_contents($overlayPath));

    if ($background === false || $overlay === false) {
        return false;
    }

    imagealphablending($background, true);
    imagesavealpha($background, true);

    $destX = 0;
    $destY = 0;
    $destW = imagesx($background);
    $destH = imagesy($background);

    if (is_array($placement)) {
        $destX = (int) round((float) ($placement["x"] ?? 0));
        $destY = (int) round((float) ($placement["y"] ?? 0));
        $destW = max(1, (int) round((float) ($placement["width"] ?? imagesx($overlay))));
        $destH = max(1, (int) round((float) ($placement["height"] ?? imagesy($overlay))));
    }

    imagecopyresampled(
        $background,
        $overlay,
        $destX,
        $destY,
        0,
        0,
        $destW,
        $destH,
        imagesx($overlay),
        imagesy($overlay)
    );

    $success = imagepng($background, $destination);

    imagedestroy($background);
    imagedestroy($overlay);

    return $success;
}