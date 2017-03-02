'use strict';

/**
 * Fetches images from service and returns them.
 */


 /*exported ImageService */
function ImageService() {
  this.url = 'http://api.giphy.com/v1/gifs/search';
}

/**
 * @return An promise that will resolve into array of images.
 */
ImageService.prototype.getImages = function (searchTerm) {
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
          resolve(parsedResponse.data);
        }
      }
      else if (this.readyState === 4) {
        reject('Call returned with code ' + this.status);
      }
    };
    xhttp.open('GET', that.url + '?api_key=' + patAppConfig.giphyKey + '&q=' + searchTerm, true);
    xhttp.send();
  });
  return promise;
};