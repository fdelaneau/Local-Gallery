// ------------------------
// Navigation
// ------------------------

const navigation = function (list, cols) {

  // keyboard navigation
  document.addEventListener("keydown", (e) => {

    switch (e.key) {

      case "ArrowRight":
        e.preventDefault();
        selectItem("next", list, cols);
        break;

      case "ArrowLeft":
        e.preventDefault();
        selectItem("previous", list, cols);
        break;

      case "ArrowUp":
        e.preventDefault();
        selectItem("up", list, cols);
        break;

      case "ArrowDown":
        e.preventDefault();
        selectItem("down", list, cols);
        break;

      case "i":
        if (e.metaKey) {
          e.preventDefault();
          if (list.id == 'gallery')
            document.getElementById('index').click();
        }
        break;

      case "f":
          e.preventDefault()
          toggleFullScreen();
        break;
    }

    if (list.id == 'albums') { return; }

    // Only listen to following keys for the gallery
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        hideSlideshow();
        break;

      case " ":
        e.preventDefault();
        if ( isSlideshowActive ) {
          hideSlideshow();
          return;
        }
        showSlideshow();
        break;

      case "Escape":
        if ( isSlideshowActive ) {
          e.preventDefault();
          hideSlideshow();
        }
        return;

      case "d":
          e.preventDefault();

          // open dialog if meta key is pressed
          if (e.metaKey) {
            document.getElementById('show-marked').click();
            return;
          }
          toggleMarkedImage();
          checkIfImageIsMarked();
        break;
    }
  }, false);

  // Set currentImage on focus
  list.addEventListener("focus", (event) => {
    currentImage = event.target.closest('a');
    currentImage.dataset.active = true;
    },
    true
  );

  // Unset active set on blur
  list.addEventListener("blur", (event) => {
    event.target.closest('a').dataset.active = false;
    },
    true
  );

  // console.log(list.id);
  if (list.id == 'albums') { return; }
  // console.log(list.id);

  // Mouse navigation
  document.addEventListener("click", (e) => {
    // Only intercept click that triggers the gallery or the slideshow
    if (!list.contains(e.target)
        && !slideshow.contains(e.target)
        || e.target.parentElement.tagName == 'BODY'
    ) {
      return;
    }

    e.preventDefault();

    if ( isSlideshowActive == false ) {
      // set the target as the current image
      currentImage = e.target;

      // if the target isn't directly the link, find the link
      if (e.target.nodeName != 'A') {
          currentImage = e.target.closest('a');
      }

      // show current image in slideshow
      showSlideshow();
    }

    // close slideshow
    else if ( e.target.nodeName == 'BUTTON' ) {
      if (e.target.classList.contains('close'))
        hideSlideshow();
      else
        toggleFullScreen();
    }

    // show next image
    else {
      selectItem('next', list, cols);
    }
  });
}

const selectItem = function (direction, list, columnsNumber) {

  currentImage = (currentImage == '') ? list.querySelector('a') : currentImage;

  let newImage;
  let parentLi = currentImage.closest('li');

  switch (direction) {
    case "up":
      for (let index = 0; index < columnsNumber; index++) {
          let previousSibling = parentLi.previousElementSibling;
          if (!previousSibling) { break; }
          parentLi = previousSibling;
      }
      break;

    case "down":
      for (let index = 0; index < columnsNumber; index++) {
        let nextSibling = parentLi.nextElementSibling;
        if (!nextSibling) { break; }
        parentLi = nextSibling;
      }
      newImage = parentLi.querySelector('a');
      break;

    case "previous":
      parentLi = parentLi.previousElementSibling;
      break;

    case "next":
      parentLi = currentImage.closest('li').nextElementSibling;
  }

  if (!parentLi) return;

  newImage = parentLi.querySelector('a');

  currentImage = newImage;

  // replace current slideshow image with new image
  if ( isSlideshowActive ) {
    checkIfImageIsMarked();
    slideshowImage.src = currentImage.querySelector("img").src;
  }

  // console.log('newImage', newImage);


  // If slideshow not active set focus on new image
  if( isSlideshowActive == false ) {
    setFocusOnCurrentImage();
  }
}

// Compute number of images per row to allow arrow up and down navigation
const calcColumns = function (list) {
    // get current gallery css style
    let gridStyle = window.getComputedStyle(list, null);
    // calculate number of columns
    let columnsNumber = gridStyle.getPropertyValue("grid-template-columns").split(" ").length;
    // console.log(columnsNumber);

  return columnsNumber;
}

const setFocusOnCurrentImage = function() {
  currentImage.dataset.active = true;
  currentImage.focus();
}

// ------------------------
// Slideshow
// ------------------------

let slideshow, slideshowImage, currentImage = "";
let isSlideshowActive = false;

const createSlideshowOverlay = function (list) {
  // create slideshow overlay
  slideshow = document.createElement("div");
  slideshow.id = "slideshow";
  slideshow.className = "slideshow";
  list.after(slideshow);

  // Create image inside overlay
  slideshowImage = document.createElement("img");
  slideshowImage.id = "img";
  slideshow.appendChild(slideshowImage);

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = 'Close <span class="shortcut">ESC</span>';
  closeBtn.className = "btn close";
  slideshow.appendChild(closeBtn);

  // Add fullscreen button
  const fullscreenBtn = document.createElement("button");
  fullscreenBtn.innerHTML = 'Fullscreen <span class="shortcut">F</span>';
  fullscreenBtn.className = "btn fullscreen";
  slideshow.appendChild(fullscreenBtn);



  // By default hide the slideshow
  slideshow.dataset.active = false;
}

const showSlideshow = function (selectedImage = currentImage) {
  // console.log('selectedImage', selectedImage);

  // replace slideshow image src then show slideshow
  slideshowImage.src = selectedImage.querySelector('img').src;
  // mark image if needed
  checkIfImageIsMarked();
  // finally mark slideshow as active
  slideshow.dataset.active = true;

  isSlideshowActive = true
}

const hideSlideshow = function () {
  // Mark slideshow as inactive
  slideshow.dataset.active = false;
  setFocusOnCurrentImage();
  isSlideshowActive = false
}

// ------------------------
// Fullscreen
// ------------------------

const toggleFullScreen = function() {
  if (!document.fullscreenElement && isSlideshowActive) {
    slideshow.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

// ------------------------
// Mark images
// ------------------------

const checkIfImageIsMarked = function () {
  slideshowImage.dataset.marked = currentImage.dataset.marked;
  currentImage.focus();
}

const toggleMarkedImage = function() {
  // Unmark image
  if (currentImage.dataset.marked === "true") {
    currentImage.dataset.marked = slideshowImage.dataset.marked = "false";
    localStorage.removeItem(currentImage.id);
    return;
  }

  // Mark image
  currentImage.dataset.marked = slideshowImage.dataset.marked = "true";
  localStorage.setItem(currentImage.id, "true");
}

const getMarkImagesFromStorage = function () {
  Object.keys(localStorage).forEach(imgId => {
    const image = document.getElementById(imgId);
    if (image) {
      image.dataset.marked = "true";
    }
  });
}

const createMarkedImagesArray = function(gallery) {
  // Select all marked images
  const markedImages = gallery.querySelectorAll('a[data-marked=true] img');

  // Extract the image names
  let markedImagesArray = Array.from(markedImages).map(img => {
    const url = new URL(img.src);
    return url;
  });

  return markedImagesArray;
}

const createMarkedImagesList = function(markedImagesArray = null, gallery) {
  if (markedImagesArray === null) {
    markedImagesArray = createMarkedImagesArray(gallery);
  }

  if ( markedImagesArray.length == 0) {
    return;
  }

  let markedImagesList = '<ul>';
      markedImagesArray.forEach(img => {
        markedImagesList += '<li><img class="preview" src="'+ img +'" /></li>';
      });
      markedImagesList += '</ul>';

  return markedImagesList;
}

const showMarkedImagesDialog = function(gallery) {

  const dialog = document.getElementById('markedImagesDialog');
  const content = dialog.getElementsByClassName('content')[0];
  const form = dialog.getElementsByTagName('form')[0];
  let htmlContent = '';

  // Retrieve all marked images
  const markedImagesArray = createMarkedImagesArray(gallery);

  // Create marked images url list
  const markedImagesList = createMarkedImagesList(markedImagesArray, gallery);

  // Add data to popin content
  if (markedImagesArray.length) {
    htmlContent = markedImagesList;

    let input = document.getElementById('markedImagesInput');
    input.value = markedImagesArray;
    form.appendChild(input);

  } else {
    htmlContent = '<p>No marked image yet!</p>';
  }
  content.innerHTML = htmlContent;

  // Bind cancel button
  const closeBtn = form.querySelector('.btn.cancel');
  // console.log(closeBtn);
  closeBtn.addEventListener("click", event => {
    event.preventDefault();
    dialog.close();
  }, false);

  // Show popin
  dialog.showModal();
}

const initMarkedImages = function(gallery) {
  getMarkImagesFromStorage();

  document.getElementById("mark-file").addEventListener("click", function(event) {
    event.preventDefault();
    toggleMarkedImage();
    checkIfImageIsMarked();
  }, false);

  document.getElementById("show-marked").addEventListener("click", function(event) {
    event.preventDefault();
    showMarkedImagesDialog(gallery)
  }, false);
}

// ------------------------
// Delete marked images
// ------------------------

const deleteMarkedImages = function() {
  const dialog = document.getElementById('markedImagesDialog');
  const form = dialog.getElementsByTagName('form')[0];

  // Create delete button
  let submit = document.createElement('button');
  submit.type = 'submit';
  submit.id = 'delete-marked-images';
  submit.innerHTML = 'Delete';
  submit.classList.add('btn','delete');
  form.prepend(submit);

  // Send marked items to be deleted
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const data = new FormData(form);

    try {
      const res = await fetch('https://gallery.ddev.site/delete.php', {
        method: 'POST',
        body: data
      });

      const resData = await res.json();
      // console.log(resData);

      dialog.close();

      removeDeletedImages(resData);

    } catch (err) {
      console.log(err);
    }
  });
}

const removeDeletedImages = function(pathsArray) {
  pathsArray.forEach(path => {

    // Extract filename without extension and gallery name from path
    let segments = path.split('/');
    let filename = segments.pop();
    filename = filename.split('.')[0];
    let gallery = segments.pop();

    // Get item parent li
    let id = 'gallery-' + gallery + '_' + filename;
    let image = document.getElementById(id);
    let li = image.parentElement;

    if ( currentImage.id == id ) {
      let newLi = li.nextElementSibling;
      console.log(newLi);
      newLi = newLi ? li.nextElementSibling : li.previousElementSibling;
      currentImage = newLi.querySelector('a');

    }

    // Remove li from DOM with animation
    let animationDuration = 500;
    li.style.setProperty('--delete-animation-duration', animationDuration + 'ms');
    li.classList.add('deleted');
    setTimeout(() => {li.remove(); currentImage.focus()}, animationDuration);
  });
}


// ------------------------
// Init
// ------------------------

const initAlbums = function (albums) {
  // By default select the first album
  currentImage = albums.querySelector('a');
  currentImage.focus();

  let cols = calcColumns(albums);

  window.addEventListener('resize', function () {
    cols = calcColumns(albums);
  }, false);

  navigation(albums, cols);
}

const initGallery = function (gallery) {
  // By default select the first image
  currentImage = gallery.querySelector('a');
  currentImage.focus();

  let cols = calcColumns(gallery);

  window.addEventListener('resize', function () {
    cols = calcColumns(gallery);
  }, false);

  navigation(gallery, cols);

  createSlideshowOverlay(gallery);

  initMarkedImages(gallery);

  deleteMarkedImages();
}

const initGalleryScript = function () {
  const albums = document.getElementById("albums");
  if (albums) {
    initAlbums(albums);
    return;
  }

  const gallery = document.getElementById("gallery");
  if (gallery) {
    initGallery(gallery);
    return;
  }
}

initGalleryScript();