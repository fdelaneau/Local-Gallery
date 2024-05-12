<?php

require_once dirname(__DIR__) . '/bootstrap.php';

// Get gallery id from url
$url = $_SERVER['QUERY_STRING'];
parse_str($url, $query);
$galleryId = $query['id'];

$galleryDir = 'images/'.$galleryId;

// Create a list of all images
$imagesList = glob($galleryDir."/*.{jpg,jpeg,gif,png,bmp,webp,mov,mp4}", GLOB_BRACE);
foreach ($imagesList as $key => $image) {
    $path = explode("/", $image);
    $name = preg_filter("/\.\w+$/","", $path[2]);

    $images[$key]['path'] = $image;
    $images[$key]['name'] = $name;
    $images[$key]['id'] = 'gallery-' . $path[1] . '_' . $name;
}

$gallery['name'] = $galleryId;

// Render our view
echo $twig->render('gallery.twig', ['gallery' => $gallery, 'images' => $images]);