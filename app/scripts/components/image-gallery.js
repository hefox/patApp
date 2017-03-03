'use strict';

/*exported ImageGallery */

/**
 * An image gallery that displays lightbox-able images.
 */
function ImageGallery(selectorId) {
  this.selectorId = selectorId;
  // The main element
  this.element = document.getElementById(this.selectorId);
  if (!this.element) {
    throw 'Unable to find element with ID ' + this.selectorId;
  }

  // Parent of all images
  this.imagesWrapper = this.createImagesWrapperElement();
  this.element.appendChild(this.imagesWrapper);

  // Link to fetch more images.
  this.addMore = this.createAddMoreLinkElement();
  this.element.appendChild(this.addMore);

  // Lightbox popup.
  this.modal = new ImageModal(this.element);

  // Service to fetch images.
  this.imageService = new ImageService();

  // Will contain current pagination data (offset, count, total_count).
  this.pagination = {};

  // Array of images
  this.images = [];

  // Initiate the gallery/fetch new images.
  this.addImages();
}

/**
 * Fetch and add images to dom.
 *
 * @param offset
 *   Numeric offset to pass to service.
 */
ImageGallery.prototype.addImages = function(offset) {
  var that = this;
  // Grab images at given offset.
  // Could grab a string from input for 'cats' instead of manual.
  that.imageService.getImages('cats', {offset: offset}).then(function(data) {
    that.pagination = data.pagination;
    var images = data.data;
    // Add images to markup.
    for (var key = 0; key < images.length; key++) {
      // Store references to prev/next images.
      images[key].prev = images[key - 1] || null;
      images[key].next = images[key + 1] || null;
      that.imagesWrapper.appendChild(that.createImageElement(images[key]));
      that.images.push(that.images[key]);
    }
    // Remove link if gotten all.
    if (that.pagination['total_count'] <= that.pagination.offset + that.pagination.count) {
      that.addMore.style.display = 'none';
    }
  });
};

/**
 * Markup function, returns an image element.
 *
 * Could have done this with some combination of innerHTML also.
 * If could use third party and was bigger project, templating language
 * would be considered.
 */
ImageGallery.prototype.createImageElement = function(image) {
  var that = this;
  var child = document.createElement('div');
  child.className = 'image-gallery__image-wrapper';
  // Lots of choices for preview, set it to var to change easily.
  var preview = image.images['fixed_height_downsampled'];
  var a = document.createElement('a');
  child.appendChild(a);
  a.className = 'image-gallery__image-link';
  a.href = image['bitly_url'];
  // On click, display image in modal.
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
  img.className = 'image-gallery__image';
  return child;
};

/**
 * Markup function, returns wrapper for images.
 */
ImageGallery.prototype.createImagesWrapperElement = function() {
  var child = document.createElement('div');
  child.className = 'image-gallery__images-wrapper';
  return child;
};

/**
 * Markup function, returns add more links.
 */
ImageGallery.prototype.createAddMoreLinkElement = function() {
  var that = this;
  var child = document.createElement('div');
  child.className = 'image-gallery__add-more-wrapper';
  var a = document.createElement('a');
  a.className = 'image-gallery__add-more';
  a.href = '#';
  a.innerHTML = 'More';
  // Onclick, fetch more images.
  a.onclick = function(event) {
    event.preventDefault();
    that.addImages(that.pagination.offset + that.pagination.count || 0);
    return false;
  };
  child.appendChild(a);
  return child;
};
