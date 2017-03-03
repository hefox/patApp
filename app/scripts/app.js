'use strict';

/**
 * Main app code.
 */
function PatApp(selectorId) {
  // For re-usuability, have imageGallery as a seperate class.
  this.imageGallery = new ImageGallery(selectorId);
}


// Initiate the app or send out an alert so user knows something went wrong.
document.addEventListener('DOMContentLoaded', function() {
  try {
    new PatApp('pat-photo-gallery');
  }
  catch (e) {
   window.alert(e.message); // pass exception object to err handler
  }
});
