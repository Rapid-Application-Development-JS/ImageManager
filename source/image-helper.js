/**
 * Image helper
 * @class ImageHelper
 */
function ImageHelper() {
}
/**
 * Checks wherewe image is cached
 * @param {String} src
 * @returns {boolean}
 * @static
 * @public
 */
ImageHelper.isCached = function (src) {
  var image = document.createElement('img');
  image.src = src;
  return image.complete || image.width + image.height > 0;
};
/**
 * Is Url
 * @param value
 * @return {boolean}
 * @static
 * @public
 */
ImageHelper.isURL = function (value) {
  if (!value.length || value.length < 5) {
    return false;
  }
  var start = value.substr(0, 4);
  return start === 'http' || start === 'ftp:' || start === 'sftp' || start.substr(0, 2) === '//';
};
/**
 * Get image file size by URL
 * @param {String} src
 * @param {Function=} callback - size in bytes
 * @static
 * @public
 */
ImageHelper.fileSize = function (src, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', src, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.getResponseHeader('Content-Length'));
      } else {
        callback(0);
      }
    }
  };
  xhr.send(null);
};
/**
 * Determines wherewe HTMLElement attached to DOM
 * @param element
 * @return {boolean}
 * @static
 * @public
 */
ImageHelper.isInDOM = function (element) {
  if (element === document) {
    return true;
  }
  element = element.parentNode;
  if (element) {
    return ImageHelper.isInDOM(element);
  }
  return false;
};
