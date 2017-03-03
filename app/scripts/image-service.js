'use strict';

/**
 * Fetches images from service and returns them.
 */


 /*exported ImageService */
function ImageService() {
  this.url = 'http://api.giphy.com/v1/gifs/search';
}

/**
 * @param searchTerm
 *  What term to search for
 * @param opts
 *  Additional options
 *   offset: what offset to pass url.
 * @return An promise that will resolve into json respone, including images.
 *  data: array of images
 *  pagination: contains current offset, count, and total_count
 */
ImageService.prototype.getImages = function (searchTerm, opts) {
  var that = this;
  var promise = new Promise(function(resolve, reject) {
    if (!patAppConfig.giphyKey) {
      reject('Giphy api key not configured, please update config.js with it.');
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var parsedResponse = JSON.parse(this.responseText);
        if (!parsedResponse) {
          reject('Unable to parse data.');
        }
        else {
          resolve(parsedResponse);
        }
      }
      else if (this.readyState === 4) {
        reject('Call returned with code ' + this.status);
      }
    };
    var url = that.url + '?api_key=' + patAppConfig.giphyKey + '&q=' + searchTerm;
    if (opts.offset) {
      url += '&offset=' + opts.offset;
    }
    xhttp.open('GET', url, true);
    xhttp.send();
  });
  return promise;
};