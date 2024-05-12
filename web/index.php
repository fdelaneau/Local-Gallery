<?php

require_once dirname(__DIR__) . '/bootstrap.php';

// Create a list of all galleries
foreach ( glob('images/*', GLOB_ONLYDIR) as $key => $folder ) {
	$imagesDir = 'images/';

	// Get gallery name
	$galleryName = str_replace($imagesDir, '', $folder);

	// Get a preview image
	$files = preg_grep('/^([^.])/', scandir($imagesDir .'/'. $galleryName));
	$filesCount = count($files);
	$firstFile = rawurlencode($imagesDir . $galleryName .'/'. $files[2]);

	$galleries[$key]['name'] = $galleryName;
	$galleries[$key]['thumbnail'] = $firstFile;
	$galleries[$key]['filesCount'] = $filesCount;
}

// Render our view
echo $twig->render('index.twig', ['galleries' => $galleries]);