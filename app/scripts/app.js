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

  this.imagesWrapper = this.createImagesWrapperElement();
  this.element.appendChild(this.imagesWrapper);

  this.addMore = this.createAddMoreLinkElement();
  this.element.appendChild(this.addMore);


  this.modal = new ImageModal(this.element);

  this.imageService = new ImageService();
  this.images = [];
  this.addImages();
}

/**
 * Fetch and add images to dom.
 */
PatApp.prototype.addImages = function(offset) {
  var that = this;
  this.imageService.getImages('cats', {offset: offset}).then(function(data) {
    that.pagination = data.pagination;
    var images = data.data;
    for (var key = 0; key < images.length; key++) {
      // Store references to prev/next images.
      images[key].prev = images[key - 1] || null;
      images[key].next = images[key + 1] || null;
      that.imagesWrapper.appendChild(that.createImageElement(images[key]));
      that.images.push(that.images[key]);
    }
    if (that.pagination.total_count <= that.pagination.offset + that.pagination.count) {
      that.addMore.style.display = 'none';
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

/**
 * Returns div that wraps images.
 */
PatApp.prototype.createImagesWrapperElement = function() {
  var child = document.createElement('div');
  child.className = 'photo-gallery__images-wrapper';
  return child;
};

/**
 * Returns div that wraps images.
 */
PatApp.prototype.createAddMoreLinkElement = function() {
  var that = this;
  var child = document.createElement('div');
  child.className = 'photo-gallery__add-more-wrapper';
  var a = document.createElement('a');
  a.className = 'photo-gallery__add-more';
  a.href = '#';
  a.innerHTML = 'More!';
  a.onclick = function(event) {
    event.preventDefault();
    that.addImages(that.pagination.offset + that.pagination.count || 0);
    return false;
  };
  child.appendChild(a);
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
