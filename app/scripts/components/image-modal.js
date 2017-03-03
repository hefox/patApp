'use strict';

/*exported ImageModal */

/**
 * Modal code.
 *
 * Handles all operations of creating and opening modal.
 */
function ImageModal(parentElement) {
  this.parentElement = parentElement;
  this.element = this.createModalElement();
  this.parentElement.appendChild(this.element);
  this.elementClass = 'image-gallery__modal-wrapper';
}

/**
 * Display the image.
 *
 * @param image
 *   Object of image information.
 *   next/prev keys are in array reference corresponding image objects.
 */
ImageModal.prototype.displayImage = function(image) {
  var that = this;
  var caption = this.element.getElementsByClassName('image-gallery__modal-image-caption')[0];
  // Service does not provide title, display slug instead.
  caption.innerHTML = image.slug || 'No Caption';
  var wrapper = this.element.getElementsByClassName('image-gallery__modal-image-wrapper')[0];
  var img = document.createElement('img');
  var imageToDisplay = image.images['original'];
  img.src = imageToDisplay.url;
  img.width = imageToDisplay.width;
  img.height = imageToDisplay.height;
  img.className = 'image-gallery__modal-image';
  // Add or replace image.
  if (this.img) {
    wrapper.replaceChild(img, this.img);
  }
  else {
    wrapper.insertBefore(img, caption);
  }
  this.img = img;
  this.element.style.display = 'block';

  // Update the next/previous links.
  function updateImageNavigationLink(text) {
    var ele = that.element.getElementsByClassName('image-gallery__modal-control--' + text)[0];
    if (!ele) {
      throw 'Unable to find ' + text + ' link';
    }
    if (image[text]) {
      ele.style.display = 'inline';
      ele.onclick = function(event) {
        event.preventDefault();
        that.displayImage(image[text]);
        return false;
      };
    }
    else {
      ele.style.display = 'none';
    }
  }
  updateImageNavigationLink('next');
  updateImageNavigationLink('prev');
};

/**
 * Create modal.
 */
ImageModal.prototype.closeModal = function() {
  this.element.style.display = 'none';
};

/**
 * Create modal.
 */
ImageModal.prototype.createModalElement = function() {
  var that = this;
  var child = document.createElement('div');
  child.style.display = 'none';
  child.className = 'image-gallery__modal-wrapper';
  child.innerHTML = '<div class="image-gallery__modal-controls">' +
      '<a href="#" class="image-gallery__modal-control image-gallery__modal-control--prev" title="Previous Image">&#60;&#60; </a> ' +
      '<a href="#" class="image-gallery__modal-control image-gallery__modal-control--next" title="Next Image">&#62;&#62; </a> ' +
      '<a href="#" class="image-gallery__modal-control image-gallery__modal-control--close" title="Close Image"> × </a>' +
    '</div>' +
    '<div class="image-gallery__modal-content">' +
      '<div class="image-gallery__modal-image-wrapper">' +
        '<div class="image-gallery__modal-image-caption"></div>' +
      '</div>' +
    '</div>';
  var span = child.getElementsByClassName('image-gallery__modal-control--close')[0];
  span.onclick = function(event) {
    event.preventDefault();
    that.closeModal();
    return false;
  };
  // Page modal on arrow clicks.
  // Triggering the next/prev to not replicate logic.
  document.onkeydown = function(event) {
    switch(event.which || event.keyCode) {
        case 37: // left arrow key
        child.getElementsByClassName('image-gallery__modal-control--prev')[0].click();
        break;

        case 39: // right arrow key
        child.getElementsByClassName('image-gallery__modal-control--next')[0].click();
        break;
    }
  };
  return child;
};
