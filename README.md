# Simple local gallery

**This code is meant for local use only!**

A pure PHP gallery with no database that allows you to view and delete images. The images are directly pulled from the disk without any change, no build preview here.

To add images to your gallery, arrange them into subfolders and place them in `web/images`. Each folder will be presented as an album with the first image as a preview.

The gallery can be navigated entirely using the keyboard.

You can mark images to be deleted as you browse, and delete them once you’re done. The list of marked images is store in the browser local storage.