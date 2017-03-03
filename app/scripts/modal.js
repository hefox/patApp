'use strict';

/*exported ImageModal */

/**
 * Modal code
 */
function ImageModal(parentElement) {
  this.parentElement = parentElement;
  this.element = this.createModalElement();
  this.parentElement.appendChild(this.element);
  this.elementClass = 'photo-gallery__modal-wrapper';
}

/**
 * Create modal.
 */
ImageModal.prototype.displayImage = function(image) {
  var that = this;
  var caption = this.element.getElementsByClassName('photo-gallery__modal-image-caption')[0];
  caption.innerHTML = image.slug || 'No Caption';
  var wrapper = this.element.getElementsByClassName('photo-gallery__modal-image-wrapper')[0];
  var img = document.createElement('img');
  var imageToDisplay = image.images['original'];
  img.src = imageToDisplay.url;
  img.width = imageToDisplay.width;
  img.height = imageToDisplay.height;
  img.className = 'photo-gallery__modal-image';
  // Add or replace image.
  if (this.img) {
    wrapper.replaceChild(img, this.img);
  }
  else {
    wrapper.insertBefore(img, caption);
  }
  this.img = img;
  this.element.style.display = 'block';
  var prev = this.element.getElementsByClassName('photo-gallery__modal-control--prev')[0];
  var next = this.element.getElementsByClassName('photo-gallery__modal-control--next')[0];
  if (image.prev) {
    prev.style.display = 'inline';
    prev.onclick = function(event) {
      event.preventDefault();
      that.displayImage(image.prev);
      return false;
    };
  }
  else {
    prev.style.display = 'none';
  }
  if (image.next) {
    next.style.display = 'inline';
    next.onclick = function(event) {
      event.preventDefault();
      that.displayImage(image.next);
      return false;
    };
  }
  else {
    next.style.display = 'none';
  }
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
  child.className = 'photo-gallery__modal-wrapper';
  child.innerHTML = '<div class="photo-gallery__modal-controls">' +
      '<a href="#" class="photo-gallery__modal-control photo-gallery__modal-control--prev" title="Previous Image">&#60; </a> ' +
      '<a href="#" class="photo-gallery__modal-control photo-gallery__modal-control--next" title="Next Image">&#62; </a> ' +
      '<a href="#" class="photo-gallery__modal-control photo-gallery__modal-control--close" title="Close Image"> × </a>' +
    '</div>' +
    '<div class="photo-gallery__modal-content">' +
      '<div class="photo-gallery__modal-image-wrapper">' +
        '<div class="photo-gallery__modal-image-caption"></div>' +
      '</div>' +
    '</div>';
  var span = child.getElementsByClassName('photo-gallery__modal-control--close')[0];
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
        child.getElementsByClassName('photo-gallery__modal-control--prev')[0].click();
        break;

        case 39: // right arrow key
        child.getElementsByClassName('photo-gallery__modal-control--next')[0].click();
        break;
    }
  };
  return child;
};
