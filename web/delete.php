<?php

$imagesList = explode(',', $_POST["markedImagesInput"]);

foreach ($imagesList as $url) {
    $path = explode('/', $url);
    $path = array_slice($path, 4);
    $path = implode('/', $path);
    $path = realpath('./images/'.$path);

    $response[] = deleteImage($path);
}

echo json_encode($response);

function deleteImage($path) {
    // If is a file then delete the file.
    if (is_file($path)) {
        unlink($path);
        return "success:". $path;

    } else {
        return "Error:". $path;
    }
}