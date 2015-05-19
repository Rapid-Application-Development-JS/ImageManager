/**
 * Load image in iframe allowing to cancel loading request
 * @class ImageCancellableLoader
 * @example
 * var icl = new ImageCancellableLoader();
 * icl.load('//image.png', function (image) {
 *     console.log('Success');
 * }, function (image) {
 *     console.warn('Image load failed');
 * });
 * // remove unnecessary iframes from document body
 * icl.destructor();
 * @constructor
 */
function ImageCancellableLoader() {
  var scope = this;
  /**
   * IFRAME element for image loading
   * @type {HTMLIFrameElement}
   * @public
   */
  scope.iframe = null;
  /**
   * IMAGE element inside IFRAME
   * @type {HTMLImageElement}
   * @public
   */
  scope.image = null;
  /**
   * Is currently loading
   * @type {boolean}
   * @public
   */
  scope.isLoading = false;
  /**
   * Source URL of image
   * @type {String}
   * @public
   */
  scope.source = null;
  /**
   * Destructor
   * @public
   */
  scope.destructor = function () {
    scope.cancelRequest();
    scope.isLoading = false;
    scope.source = null;
    scope.image = null;
    document.body.removeChild(scope.iframe);
    scope.iframe = null;
  };
  /**
   * Initialize IFrame needed for image loading
   * @private
   */
  function _initIFrame() {
    /** @type HTMLIFrameElement */
    scope.iframe = document.createElement('iframe');
    scope.iframe.setAttribute('src', '');
    scope.iframe.style.setProperty('display', 'none', '');
    scope.iframe.onload = function () {
      scope.iframe.onload = null;
      scope.image = document.createElement('img');
      (scope.iframe.contentDocument || scope.iframe.contentWindow).body.appendChild(scope.image);
      scope.image.onload = function () {
        if (!scope.source || scope.image.src !== scope.source) {
          return;
        }
        scope.isLoading = false;
        scope.image.onload = null;
        return scope.onLoad(scope.image);
      }.bind(scope);
      scope.image.onerror = function () {
        scope.isLoading = false;
        scope.image.onerror = null;
        return scope.onFailure(scope.image);
      }.bind(scope);
    }.bind(scope);
    document.body.appendChild(scope.iframe);
  }

  /**
   * Cancel loading request
   * @return {boolean}
   * @public
   */
  scope.cancelRequest = function () {
    var currentWindow;
    if (scope.isLoading && scope.image) {
      /** @type Window|Object */
      currentWindow = scope.iframe.contentWindow;
      if (currentWindow.stop) {
        currentWindow.stop();
      } else {
        currentWindow = scope.iframe.contentDocument;
        if (currentWindow.execCommand) {
          currentWindow.execCommand('Stop', false);
        }
      }
    }
    return scope.isLoading = false;
  };
  /**
   * Load image in browser cache
   * @param {String} src
   * @param {Function} onSuccess
   * @param {Function} onError
   * @public
   */
  scope.load = function (src, onSuccess, onError) {
    if (!scope.iframe) {
      _initIFrame();
    }
    var tempImage;
    if (!scope.image) {
      tempImage = new Image();
      tempImage.onload = function () {
        return onSuccess(tempImage);
      };
      tempImage.onerror = function () {
        return onError(tempImage);
      };
      tempImage.src = src;
      return;
    }
    scope.source = src;
    /**
     * @type {Function}
     * @public
     */
    scope.onLoad = onSuccess;
    /**
     * @type {Function}
     * @public
     */
    scope.onFailure = onError;
    if (scope.image.src === src) {
      if (scope.image.complete) {
        scope.cancelRequest();
        onSuccess(scope.image);
      }
      return;
    }
    scope.cancelRequest();
    scope.isLoading = true;
    return scope.image.src = src;
  }
}
