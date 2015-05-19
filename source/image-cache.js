/**
 * Image cache
 * @class ImageCache
 */
function ImageCache() {
}
ImageCache.prototype = new CacheLRU;
/**
 * Add image to list, put it into cache
 * @param {Array|HTMLImageElement|{element: HTMLImageElement, timestamp: number|undefined}|String} image
 * @public
 */
ImageCache.prototype.add = function (image) {
  if (image instanceof HTMLImageElement) {
    image = {element: image};
  }
  if (_.isString(image)) {
    var img = new Image;
    img.setAttribute('src', image);
    image = {
      element: img
    };
  }
  image.timestamp = image.timestamp || Date.now();
  this.put(image.element.src, image);
  return image;
};
