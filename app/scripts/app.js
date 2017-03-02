'use strict';

/**
 * Main app code.
 */
function PatApp(selectorId) {
  this.selectorId = selectorId;
  this.element = document.getElementById(this.selectorId);
  if (!this.element) {
    throw 'Unable to find element with ID ' + this.selectorId;
  }
}

/**
 * Perform app setup.
 */
PatApp.prototype.init = function() {
  this.imageService = new ImageService();
  this.addImages();
};

PatApp.prototype.addImages = function() {
  var that = this;
  this.images = this.imageService.getImages('cats').then(function(images) {
    for (var key in images) {
      that.element.appendChild(that.createImageElement(images[key]));
    }
  });
};

/**
 * Returns a node ready for insert into dom with image tag.
 */
PatApp.prototype.createImageElement = function(image) {
  var child = document.createElement('div');
  child.className = 'photo-gallery__image-wrapper';
  // Lots of choices for preview, set it to var to change easily.
  var preview = image.images['fixed_height_downsampled'];
  var a = document.createElement('a');
  child.appendChild(a);
  a.className = 'photo-gallery__image-link';
  a.href = image['bitly_url'];
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
    var app = new PatApp('pat-photo-gallery');
    app.init();
  }
  catch (e) {
   window.alert.log(e.message); // pass exception object to err handler
  }
});