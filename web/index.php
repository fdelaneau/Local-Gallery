<?php

require_once dirname(__DIR__) . '/bootstrap.php';

$galleriesDir = 'images/';
$galleriesList = glob('images/[!@]*', GLOB_ONLYDIR);

// Create a list of all galleries
foreach ( $galleriesList as $key => $folder ) {
	// Get gallery name
	$galleryName = str_replace($galleriesDir, '', $folder);

	// Get all files
	$galleryDir = 'images/'.$galleryName;
	$imagesList = glob($galleryDir."/*.{jpg,jpeg,gif,png,bmp,webp,mov,mp4}", GLOB_BRACE);

	// Get the file count
	$filesCount = count($imagesList);

	// Get a preview image
	$firstImage = current($imagesList);

	$galleries[$key]['name'] = $galleryName;
	$galleries[$key]['filesCount'] = $filesCount;
	$galleries[$key]['thumbnail'] = $firstImage;
}

// Render our view
echo $twig->render('index.twig', ['galleries' => $galleries]);