'use strict';

/**


/**
 * Main app code.
 */
function PatApp(selectorId) {
  this.selectorId = selectorId;
  this.element = document.getElementById(this.selectorId);
  if (!this.element) {
    throw 'Unable to find element with ID ' + this.selectorId;
  }
  this.imageService = new ImageService();
  this.modal = new ImageModal(this.element);
  this.addImages();
}

/**
 * Fetch and add images to dom.
 */
PatApp.prototype.addImages = function() {
  var that = this;
  this.images = this.imageService.getImages('cats').then(function(images) {
    for (var key = 0; key < images.length; key++) {
      // Store references to prev/next images.
      images[key].prev = images[key - 1] || null;
      images[key].next = images[key + 1] || null;
      that.element.appendChild(that.createImageElement(images[key]));
    }
  });
};

/**
 * Returns a node ready for insert into dom with image tag.
 *
 * Could have done this with some combination of innerHTML, choice this
 * method for ease of adding onclick. Prefer using some type of templates.
 */
PatApp.prototype.createImageElement = function(image) {
  var that = this;
  var child = document.createElement('div');
  child.className = 'photo-gallery__image-wrapper';
  // Lots of choices for preview, set it to var to change easily.
  var preview = image.images['fixed_height_downsampled'];
  var a = document.createElement('a');
  child.appendChild(a);
  a.className = 'photo-gallery__image-link';
  a.href = image['bitly_url'];
  a.onclick = function(event) {
    event.preventDefault();
    that.modal.displayImage(image);
    return false;
  };
  var img = document.createElement('img');
  a.appendChild(img);
  img.width = preview.width;
  img.height = preview.height;
  img.src = preview.url;
  img.className = 'photo-gallery__image';
  return child;
};

// Well supported way to add an on document ready event.
document.addEventListener('DOMContentLoaded', function() {
  try {
    new PatApp('pat-photo-gallery');
  }
  catch (e) {
   window.alert(e.message); // pass exception object to err handler
  }
});
