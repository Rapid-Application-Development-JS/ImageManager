(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define("image-manager", ["cachelru"], function () {
      return (root.ImageManager = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = (root.ImageManager = factory());
  } else {
    root.ImageManager = factory();
  }
}(this, function () {
  'use strict';
  /**
   * Utility class
   * @class _
   */
  function _() {
  }

  /**
   * Maximum numeric value representable
   * @type {number}
   * @static
   * @public
   */
  _.MAX_NUMBER = Number.MAX_VALUE;
  /**
   * Evaluates if passed value is function
   * @param {Function|*} func
   * @param {Array} args
   * @param {Object=null} context
   * @static
   * @public
   */
  _.call = function (func, args, context) {
    if (arguments.length < 3) {
      context = null;
      if (arguments.length < 2) {
        args = [];
      }
    }
    _.isFunction(func) && func.apply(context, args);
  };
  /**
   * Extend Object
   * @return {Object}
   * @static
   * @public
   */
  _.extend = function () {
    var argsLength = arguments.length;
    if (!argsLength) {
      return {};
    }
    var collection1 = argsLength ? arguments[0] : {};
    var collection2 = argsLength < 2 ? {} : arguments[1];
    var newObject = {};
    if (argsLength > 2) {
      for (var index = 0; index <= argsLength; index += 1) {
        newObject = _.extend(newObject, arguments[index]);
      }
      return newObject;
    }
    for (var property in collection1) {
      if (collection1.hasOwnProperty(property)) {
        newObject[property] = collection1[property];
      }
    }
    for (property in collection2) {
      if (collection2.hasOwnProperty(property)) {
        newObject[property] = collection2[property];
      }
    }
    return newObject;
  };
  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate
   * @param {Array} collection
   * @param {*} value
   * @return {boolean}
   * @static
   * @public
   */
  _.includes = function (collection, value) {
    if (_.isArray(collection)) {
      return Array['includes'] ? collection['includes'](value) : collection.indexOf(value) > -1;
    }
    if (_.isObject(collection)) {
      for (var prop in collection) {
        if (collection.hasOwnProperty(prop)) {
          if (collection[prop] === value) {
            return true;
          }
        }
      }
    }
    return false;
  };
  /**
   * Method returns true if an object is an array
   * @param {*} list
   * @return {boolean}
   * @static
   * @public
   */
  _.isArray = function (list) {
    if (Array.isArray) {
      return Array.isArray(list);
    } else {
      return Object.prototype.toString.call(list) === '[object Array]';
    }
  };
  /**
   * Checks if `value` is function.
   * @param {*} variable
   * @return {boolean}
   * @static
   * @public
   */
  _.isFunction = function (variable) {
    return typeof variable === 'function';
  };
  /**
   * Checks if `value` is object-like.
   * @param {*} variable
   * @return {boolean}
   * @static
   * @public
   */
  _.isObject = function (variable) {
    return _.varType(variable) === 'object';
  };
  /**
   * Checks if `value` is string.
   * @param {*} variable
   * @return {boolean}
   * @static
   * @public
   */
  _.isString = function (variable) {
    return typeof variable === 'string';
  };
  /**
   * Iterates over a collection of elements, yielding each in turn to an iteratee function
   * @param {Array|Object} collection
   * @param {Function} iteratee
   * @param {Object=} context
   * @param {Boolean=} returnContext
   * @return {Array|Object}
   * @static
   * @public
   */
  _.forEach = function (collection, iteratee, context, returnContext) {
    if (!_.isObject(collection) && !_.isArray(collection)) {
      return returnContext ? context : collection;
    }
    var index = 0, length;
    if (collection.length === +collection.length) {
      for (index, length = collection.length; index < length; index += 1) {
        iteratee.call(context, collection[index], index, collection);
      }
    } else {
      var keys = _.keys(collection);
      for (index, length = keys.length; index < length; index += 1) {
        iteratee.call(context, collection[keys[index]], keys[index], collection);
      }
    }
    return returnContext ? context : collection;
  };
  /**
   * Get property from object
   * @param {*} object
   * @param {Array|String} propertyName
   * @param {*=null} onFailure
   * @return {*}
   * @static
   * @public
   */
  _.getInPath = function (object, propertyName, onFailure) {
    arguments.length < 3 && (onFailure = null);
    if (!_.isObject(object)) {
      return onFailure;
    }
    if (_.isString(propertyName)) {
      if (_.has(object, propertyName)) {
        return object[propertyName];
      } else {
        return onFailure;
      }
    }
    if (_.varType(propertyName) !== 'array') {
      return onFailure;
    }
    var index = 0;
    var length = propertyName.length;
    for (index; index < length; index += 1) {
      var part = propertyName[index];
      if (!_.has(object, part)) {
        return onFailure;
      }
      object = object[part];
    }
    return object;
  };
  /**
   * Determining if a javascript object has a given property
   * @param {*} object
   * @param {String} propertyName
   * @static
   * @public
   */
  _.has = function (object, propertyName) {
    return _.varType(object) === 'object' && propertyName in object;
  };
  /**
   * Determining if a javascript object has a given property
   * @param {*} object
   * @param {String} propertyName
   * @param {String} propertyType
   * @return {boolean}
   * @static
   * @public
   */
  _.hasType = function (object, propertyName, propertyType) {
    if (!_.has(object, propertyName)) {
      return false;
    }
    return _.varTypeIn(object[propertyName], propertyType);
  };
  /**
   * Creates an array of the own enumerable property names of object
   * @param {Object} collection
   * @return {Array}
   * @static
   * @public
   */
  _.keys = function (collection) {
    return Object.keys(collection).sort();
  };
  /**
   * Creates an array of values by running each element in collection through iteratee
   * @param {Function} iteratee
   * @param {Function} iteratee
   * @param {Array|Object} collection
   * @param {Object} context
   * @return {Array}
   * @static
   * @public
   */
  _.map = function (iteratee, collection, context) {
    var result = [];
    _.forEach(collection, function () {
      result.push(iteratee.apply(context, arguments));
    });
    return result;
  };
  /**
   * Return 32-bit integer that specifies the number of elements in list
   * @param {*} list
   * @returns {boolean|number}
   * @static
   * @public
   */
  _.size = function (list) {
    var listType = _.varType(list);
    if (listType === 'array') {
      return list.filter(function (value) {
        return value !== undefined;
      }).length;
    } else if (listType === 'object') {
      return Object.keys(list).length;
    }
    return false;
  };
  /**
   * Invokes the given iteratee function <times>.
   * Each invocation of iteratee is called with an index argument. Produces an array of the returned values.
   * @param {number} times
   * @param {Function} iterator
   * @returns {Array}
   * @static
   * @public
   */
  _.times = function (times, iterator) {
    var accum = new Array(Math.max(0, times));
    for (var index = 0; index < times; index += 1) {
      accum[index] = iterator.call();
    }
    return accum;
  };
  /**
   * Retrieve all the elements contained in the collection, as an array
   * @param {Array|Object} collection
   * @param {number=0} startIndex
   * @return {Array}
   * @static
   * @public
   */
  _.toArray = function (collection, startIndex) {
    var result = [];
    var index = arguments.length >> 1 ? startIndex : 0;
    var length = collection.length;
    for (index; index < length; index += 1) {
      result.push(collection[index]);
    }
    return result;
  };
  /**
   * Parses any value and returns a number
   * @param {*} value
   * @param {number=0} onFailedConversion
   * @param {number=0} minValue
   * @param {number=} maxValue
   * @static
   * @public
   */
  _.toNumber = function (value, onFailedConversion, minValue, maxValue) {
    value = parseFloat(value);
    if (!isFinite(value) || isNaN(value)) {
      return onFailedConversion;
    }
    value = parseFloat(value.toFixed(0));
    if (arguments.length < 4) {
      maxValue = _.MAX_NUMBER;
      if (arguments.length < 3) {
        minValue = 0;
        if (arguments.length < 2) {
          onFailedConversion = 0;
        }
      }
    }
    if (!isFinite(value)) {
      return onFailedConversion;
    }
    if (value > maxValue) {
      return maxValue;
    }
    if (value < minValue) {
      return minValue;
    }
    return value;
  };
  /**
   * Filter variable
   * @param {*} value
   * @param {Array|String|null} allowedTypes
   * @param {Object|String|null} filter
   * @param {*=null} defaltValue
   * @return {*}
   * @static
   * @public
   */
  _.varFilter = function (value, allowedTypes, filter, defaltValue) {
    if (arguments.length < 4) {
      defaltValue = null;
      if (arguments.length < 3) {
        filter = {};
        if (arguments.length < 2) {
          allowedTypes = [];
        }
      }
    }
    if (_.isArray(allowedTypes) && allowedTypes.length) {
      if (!_.varTypeIn(value, allowedTypes)) {
        return defaltValue;
      }
    } else if (_.isString(allowedTypes)) {
      if (!_.varTypeIn(value, [allowedTypes])) {
        return defaltValue;
      }
    }
    if ((_.isObject(filter) && _.size(filter)) || _.isString(filter)) {
      switch (_.isString(filter) ? filter : filter['type']) {
        case 'boolean':
          return !!value;
        case 'number':
        case 'integer':
        case 'float':
          if (_.isObject(filter)) {
            return _.toNumber(value, defaltValue,
              _.getInPath(filter, 'min', 0),
              _.getInPath(filter, 'max', _.MAX_NUMBER)
            );
          }
          return _.toNumber(value, defaltValue);
        default:
          return defaltValue;
      }
    }
    return value;
  };
  /**
   * Get variable type
   * @param {*} variable
   * @return {string}
   * @static
   * @public
   */
  _.varType = function (variable) {
    return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
  };
  /**
   * Variable type allowance
   * @param {*} variable
   * @param {Array|String} types
   * @return {boolean}
   * @static
   * @public
   */
  _.varTypeIn = function (variable, types) {
    if (_.varType(types) === 'array') {
      return !!~types.indexOf(_.varType(variable));
    } else {
      return _.varType(variable) === (types + '');
    }
  };
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

  /**
   * Image loading
   * @class ImageLoader
   * @param {Object} options
   * @param {Object} defaults
   * @constructor
   */
  function ImageLoader(options, defaults) {
    var scope = this;
    /**
     * Unique ID
     * @type {number}
     */
    scope.id;
    /**
     * Src attribute
     * @type {String}
     */
    scope.src;
    /**
     * Allow cancel of image loading
     * @type {boolean}
     */
    scope.fullRepeal = false;
    /**
     * Is currently paused
     * @type {boolean}
     */
    scope.isPaused = false;
    /**
     * Callback in case of successful image loading
     * @type {Function}
     */
    scope.onSuccess = null;
    /**
     * Callback in case of error
     * @type {Function}
     */
    scope.onError = null;
    /**
     * Callback on all opertions is over
     * @type {Function}
     */
    scope.onResolve = null;
    /**
     * Maximum redowloads of image
     * @type {number}
     */
    scope.maxDownloads = 1;
    /**
     * Redownload counter
     * @type {number}
     */
    scope.currentDownloads = 0;
    /**
     * HTML Image element
     * @type {Object}
     */
    scope.image;
    /**
     * Is image loading completed
     * @type {boolean}
     */
    scope.completed = false;
    /**
     * Is image loading was started
     * @type {boolean}
     */
    scope.isLoadingStarted = false;
    /**
     * Constructor
     * @param {Object} options
     * @param {Object} defaults
     * @public
     */
    function _initialize(options, defaults) {
      scope.id = _.getInPath(options, 'id', 0);
      if (scope.id === 0) {
        _cfgDebug && console.warn('ImageLoader->constructor() - ID is empty');
      }
      scope.src = _.getInPath(options, 'src', '');
      if (!scope.src || scope.src.length < 5) {
        _cfgDebug && console.warn('ImageLoader->constructor() - SRC is empty');
      }
      scope.fullRepeal = _.getInPath(options, 'fullRepeal', defaults.fullRepeal);
      scope.onSuccess = _.getInPath(options, 'onSuccess', defaults.onSuccess);
      scope.onError = _.getInPath(options, 'onError', defaults.onError);
      scope.onResolve = _.getInPath(options, 'onResolve', defaults.onResolve);
      scope.maxDownloads = _.toNumber(
        _.getInPath(options, 'maxDownloads', defaults.maxDownloads),
        defaults.maxDownloads,
        1
      );
      scope.isPaused = _.getInPath(options, 'isPaused', defaults.isPaused);
    }

    _initialize(options, defaults);
    /**
     * Dispatch image loading
     * @return {boolean}
     * @public
     */
    scope.dispatchLoading = function () {
      if (scope.isPaused) {
        return false;
      }
      scope.isLoadingStarted = true;
      if (ImageHelper.isCached(scope.src)) {
        _cfgDebug && console.info('ImageLoader->dispatchLoading() - Image is already in cache: ' + scope.src);
        scope.onLoad();
        return true;
      }
      scope.initImage();
      return true;
    };
    /**
     * Initialize image
     * @public
     */
    scope.initImage = function () {
      if (!scope.fullRepeal) {
        scope.image = new Image();
        scope.image.src = scope.src;
        scope.image.onload = scope.onLoad.bind(scope);
        scope.image.onerror = scope.onFailed.bind(scope);
      } else {
        scope.image.src = scope.src;
        scope.image = new ImageCancellableLoader();
        scope.image.load(scope.src, scope.onLoad.bind(scope), scope.onFailed.bind(scope));
      }
    };
    /**
     * Return basic information about image
     * @return {Object}
     * @public
     */
    scope.getImageinfo = function () {
      return {
        id: scope.id,
        src: scope.src,
        completed: scope.completed
      };
    };
    /**
     * Called when image loaded
     * @public
     */
    scope.onLoad = function () {
      scope.completed = true;
      scope.image = null;
      _cfgDebug && console.info('ImageLoader->onLoad() - Image is loaded: ' + scope.src);
      _cfgDebug && console.dir(scope);
      _.call(scope.onSuccess, [scope.getImageinfo()]);
      _.call(scope.onComplete, [scope]);
    };
    /**
     * Called when image load failed
     * @public
     */
    scope.onFailed = function () {
      scope.completed = false;
      scope.currentDownloads += 1;
      if (scope.currentDownloads >= scope.maxDownloads) {
        _cfgDebug && console.info('ImageLoader->onFailed() - Image is not loaded' +
          (scope.maxDownloads > 1 ? '. Attempts were made: ' + scope.currentDownloads : ''));
        _cfgDebug && console.dir(scope);
        _.call(scope.onError, [scope.getImageinfo()]);
        _.call(scope.onComplete, [scope]);
      } else {
        _cfgDebug && console.info('ImageLoader->onFailed() - ' +
          'Image is not loaded. Attempt ' + scope.currentDownloads + '/' + scope.maxDownloads);
        _cfgDebug && console.dir(scope);
        scope.initImage();
      }
    };
    /**
     * Called when image loading completed
     * @public
     */
    scope.onComplete = function () {
      _cfgDebug && console.warn('ImageLoader->onComplete() - Warning! This is dummy function!');
      _cfgDebug && console.dir(scope);
      _.call(scope.onResolve, [scope.getImageinfo()]);
    };
    /**
     * Called when image loading quits
     * @public
     */
    scope.onDrop = function () {
      _cfgDebug && console.info('ImageLoader->onDrop() - Image loading completed');
      _cfgDebug && console.dir(scope);
      if (scope.fullRepeal) {
        scope.image.destructor();
      }
    }
  }

  /**
   * Print log
   * @type {boolean}
   * @private
   */
  var _cfgDebug = false;

  /**
   * Image manager
   * @param {boolean} waitForDocumentLoad
   * @param {number=} cache
   * @constructor
   * @class ImageManager
   */
  function ImageManager(waitForDocumentLoad, cache) {
    var scope = this;
    if (arguments.length < 2) {
      cache = 50;
      if (arguments.length) {
        waitForDocumentLoad = true;
      } else {
        waitForDocumentLoad = !!waitForDocumentLoad;
      }
    } else {
      cache = _.toNumber(cache, 50, 2, _.MAX_NUMBER);
    }
    /**
     * Loading images
     * @type {Object}
     * @private
     */
    var _listOfImages = {};
    /**
     * Image list size limit
     * @type {number}
     * @private
     */
    var _listSize = _.MAX_NUMBER;
    /**
     * Maximum current active load requests
     * @type {number}
     * @private
     */
    var _maxActiveDerived = 1;
    /**
     * Currently active downloads
     * @type {number}
     * @private
     */
    var _currentActiveDerived = 0;
    /**
     * Key value pair of images source and ID
     * @type {{src: number}}
     * @private
     */
    var _srcList = {};
    /**
     * Autoincrement ID for image list
     * @type {number}
     * @private
     */
    var _id = 0;
    /**
     * Callback called when everything is done
     * @type {Function|null}
     */
    scope.onFinish = null;
    /**
     * Is downloads currently active
     * @type {boolean}
     * @private
     */
    var _isActive = false;
    /**
     * Default configuration for loading of images
     * @type {Object}
     * @private
     */
    var _configDefault = {
      fullRepeal: false,
      isPaused: false,
      maxDownloads: 1,
      onError: null,
      onResolve: null,
      onSuccess: null
    };
    /**
     * Current configuration for loading images
     * @type {Object}
     * @private
     */
    var _config = {};
    /**
     * Object holding HTMLImageElement to prevent cache cleaning
     * @type {ImageCache}
     * @private
     */
    var _cache;
    /**
     * Gets the settings for downloading images
     * @return {Object}
     * @public
     */
    scope.configGet = function () {
      return _.extend(_config, {});
    };
    /**
     * Resets the configuration
     * @public
     */
    scope.configReset = function () {
      _config = _.extend(_configDefault, {});
    };
    /**
     * Constructor
     * @param {boolean=} waitForDocumentLoad
     * @param {number=} cache
     * @public
     */
    function _initialize(waitForDocumentLoad, cache) {
      scope.configReset();
      _cache = new ImageCache(cache);
      if (waitForDocumentLoad) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          _cfgDebug && console.info('ImageManager->constructor() - Document is\'t ready');
          _isActive = true;
          _checkOut();
        } else {
          document.addEventListener('DOMContentLoaded', function () {
            _cfgDebug && console.info('ImageManager->constructor() - Document ready');
            _isActive = true;
            _checkOut();
          }.bind(scope), false);
        }
      } else {
        _cfgDebug && console.info('ImageManager->constructor() - Do not wait for document loading');
        _isActive = true;
        _checkOut();
      }
    }

    _initialize(waitForDocumentLoad, cache);
    Object.defineProperty(scope, 'activeDerived', {
      /**
       * Get current download limit
       * @return {number}
       * @public
       */
      get: function () {
        return _maxActiveDerived;
      },
      /**
       * Set current active downlod limit
       * @param {number=1} newActiveSize
       * @public
       */
      set: function (newActiveSize) {
        var cleanSize = _.toNumber(newActiveSize, 1, 1);
        if (cleanSize === _maxActiveDerived) {
          _cfgDebug && console.info(
            'ImageManager->activeDerived() - The number of active downloads hasn\'t changed: ' + cleanSize);
          return;
        }
        _cfgDebug && console.info(
          'ImageManager->activeDerived() - ' +
          'The number of active downloads changed from ' + _maxActiveDerived + ' to ' + cleanSize);
        _maxActiveDerived = cleanSize;
        _onDownloadSizeChange(cleanSize);
      }
    });
    Object.defineProperty(scope, 'listSize', {
      /**
       * Returns the size of the image list
       * @return {number}
       * @public
       */
      get: function () {
        return _listSize;
      },
      /**
       * Set image size list
       * @param {number=1} newSize
       * @public
       */
      set: function (newSize) {
        var cleanSize = _.toNumber(newSize, 1, 1);
        var currentSize = _listSize;
        if (cleanSize === currentSize) {
          _cfgDebug && console.info('ImageManager->listSize - The size of the list is\'t changed: ' + currentSize);
          return;
        }
        _cfgDebug && console.info(
          'ImageManager->listSize - The size of the list has changed from ' + currentSize + ' to ' + cleanSize);
        _listSize = cleanSize;
        _onListSizeChange(currentSize);
      }
    });
    Object.defineProperty(scope, 'imageListCurrSize', {
      /**
       * Return current size of image list
       * @return {number}
       * @public
       */
      get: function () {
        return _.size(_listOfImages);
      },
      /**
       * Dummy setter for image list size
       * @param {*} value
       * @public
       */
      set: function (value) {
      }
    });
    Object.defineProperty(scope, 'debug', {
      /**
       * Returns the state of the debug mode
       * @return {boolean}
       * @public
       */
      get: function () {
        return _cfgDebug;
      },
      /**
       * Sets a flag to display debug logs
       * @param {boolean=false} toDebug
       * @public
       */
      set: function (toDebug) {
        _cfgDebug = !!toDebug;
      }
    });
    Object.defineProperty(scope, 'srcList', {
      /**
       * Image URL list
       * @return {Array}
       * @public
       */
      get: function () {
        return _.keys(_srcList).map(function (src) {
          return src;
        });
      },
      /**
       * Dummy image URL list setter
       * @param {*} value
       * @public
       */
      set: function (value) {
      }
    });
    Object.defineProperty(scope, 'cacheLimit', {
      /**
       * Return current cache limit
       * @return {number}
       */
      get: function () {
        return _cache.limit;
      },
      /**
       * Set image cache limit. At least two.
       * @param {number} limit
       */
      set: function (limit) {
        _cache.limit = limit;
      }
    });
    /**
     * Start downloading images
     * @private
     */
    function _checkOut() {
      if (!_isActive) {
        _cfgDebug && console.info('ImageManager->_checkOut() - The loader is not active');
        return;
      }
      if (!scope.imageListCurrSize) {
        _cfgDebug && console.info('ImageManager->_checkOut() - Image list is empty');
        if (_id) {
          _cfgDebug && console.info(
            'ImageManager->_checkOut() - All operations are carried out, get out of the handler');
          _onAllDone();
        } else {
          _cfgDebug && console.info('ImageManager->_checkOut() - Emty ID means there was not any operations');
        }
        return;
      }
      if (_currentActiveDerived >= _maxActiveDerived) {
        _cfgDebug && console.info(
          'ImageManager->_checkOut() - ' +
          'Now all downloads are active: ' + _currentActiveDerived + ' of ' + _maxActiveDerived);
        return;
      }
      _cfgDebug && console.info('ImageManager->_checkOut() - Begin to look through the list');
      _cfgDebug && console.dir(_.keys(_listOfImages));
      _.keys(_listOfImages).every(function (imageId) {
        if (_currentActiveDerived >= _maxActiveDerived) {
          _cfgDebug && console.info(
            'ImageManager->_checkOut() - ' +
            'Skip. All downloads are active: ' + _currentActiveDerived + ' of ' + _maxActiveDerived);
          return false;
        }
        if (_listOfImages[imageId].isPaused) {
          _cfgDebug && console.info(
            'ImageManager->_checkOut() - The image in the pause: ' + _listOfImages[imageId].src);
          _cfgDebug && console.dir(_listOfImages[imageId]);
        } else {
          if (!_listOfImages[imageId].isLoadingStarted) {
            _currentActiveDerived += 1;
            _listOfImages[imageId].dispatchLoading();
            _cfgDebug && console.info(
              'ImageManager->_checkOut() - Image load started: ' + _listOfImages[imageId].src);
            _cfgDebug && console.dir(_listOfImages[imageId]);
          } else {
            _cfgDebug && console.info(
              'ImageManager->_checkOut() - Image load already started: ' + _listOfImages[imageId].src);
            _cfgDebug && console.dir(_listOfImages[imageId]);
          }
        }
        return true;
      }.bind(scope));
    }

    /**
     * Event called when all done
     * @private
     */
    function _onAllDone() {
      _cfgDebug && console.info('ImageManager->_onAllDone() - All actions are completed');
      _.call(scope.onFinish, [], scope);
    }

    /**
     * Function should be called when resizing list
     * @param {number} oldListSize
     * @private
     */
    function _onListSizeChange(oldListSize) {
      _cfgDebug && console.info('ImageManager->_onListSizeChange(' + oldListSize + ')');
      if (scope.listSize >= oldListSize) {
        return;
      }
      if (!scope.imageListCurrSize) {
        return;
      }
      var newSize = scope.listSize;
      var currSize = scope.imageListCurrSize;
      if (newSize > currSize) {
        return;
      }
      _.keys(_listOfImages).splice(0, currSize - newSize).forEach(function (id) {
        _listOfImages[id].onComplete(_listOfImages[id]);
      });
    }

    /**
     * Get first image in list
     * @return {boolean|Object}
     * @private
     */
    function _imageGetFirst() {
      if (!scope.imageListCurrSize) {
        return false;
      }
      return _listOfImages[_.keys(_listOfImages)[0]];
    }

    /**
     * Event fired when change active downloads limit
     * @param {number} newActiveDownloadsSize
     * @private
     */
    function _onDownloadSizeChange(newActiveDownloadsSize) {
      _cfgDebug && console.info('ImageManager->_onDownloadSizeChange(' + newActiveDownloadsSize + ')');
    }

    /**
     * Is URL in the image list
     * @param {String} srcUrl
     * @return {boolean}
     * @public
     */
    scope.hasSource = function (srcUrl) {
      return srcUrl in _srcList;
    };
    /**
     * Is scope ID exists
     * @param {number|String} id
     * @return {boolean}
     * @public
     */
    function _hasId(id) {
      return id in _listOfImages;
    }

    /**
     * Adds an object to the image list
     * @param {String} srcUrl
     * @param {Object=} options
     * @return {boolean|number}
     * @public
     */
    scope.loadImage = function (srcUrl, options) {
      if (!_.isString(srcUrl) || srcUrl.length < 5) {
        _cfgDebug && console.info('ImageManager->loadImage() - Wrong SRC: ' + srcUrl);
        _.call(options.onError, [{
          id: -1,
          src: srcUrl,
          completed: false
        }]);
        return false;
      }
      if (scope.hasSource(srcUrl)) {
        _cfgDebug && console.info('ImageManager->loadImage() - SRC already exists: ' + srcUrl);
        _.call(options.onResolve, [{
          id: -1,
          src: srcUrl,
          completed: true
        }]);
        return false;
      }
      var currListSize = scope.imageListCurrSize;
      if ((currListSize > 0) && (currListSize + 1 > scope.listSize)) {
        var imageLoader = _imageGetFirst();
        imageLoader.onComplete(imageLoader);
      }
      _id += 1;
      options = _.extend(_config, _.isObject(options) ? options : {});
      options.src = srcUrl;
      options.id = _id;
      _srcList[srcUrl] = _id;
      var img = new ImageLoader(options, scope.configGet());
      img.onComplete = function (imageLoader) {
        if (!imageLoader.isPaused) {
          _currentActiveDerived -= 1;
        }
        imageLoader.onDrop();
        _removeImageFromList(imageLoader.src, imageLoader);
      }.bind(scope);
      _listOfImages[_id] = img;
      _checkOut();
      return _id;
    };
    /**
     * Remove image from list
     * @param srcUrl
     * @param imageLoader
     * @private
     */
    function _removeImageFromList(srcUrl, imageLoader) {
      _cfgDebug && console.info('ImageManager->_removeImageFromList() - Remove by src: ' + srcUrl);
      _cfgDebug && console.dir(imageLoader);
      var id = _srcList[srcUrl];
      delete _listOfImages[id];
      delete _srcList[srcUrl];
      _checkOut();
    }

    /**
     * Set configuration parameter
     * @param {Object|String} configName
     * @param {*} configValue
     * @public
     */
    scope.configSet = function (configName, configValue) {
      if (_.isObject(configName)) {
        return _.forEach(configName, function (value, name) {
          return scope.configSet(name, value);
        });
      }
      if (!_.isString(configName)) {
        _cfgDebug && console.warn('ImageManager->configSet() - Parameter must be string [' + configName + ']');
        return;
      }
      var setable = {
        fullRepeal: function (value) {
          return _.varFilter(value, 'boolean', 0, false);
        },
        maxDownloads: function (value) {
          return _.varFilter(value, 'number', {type: 'number', min: 1}, 1);
        },
        onError: function (value) {
          return _.isFunction(value) ? value : null;
        },
        onResolve: function (value) {
          return _.isFunction(value) ? value : null;
        },
        onSuccess: function (value) {
          return _.isFunction(value) ? value : null;
        }
      };
      if (!_.includes(_.keys(setable), configName)) {
        _cfgDebug && console.warn('ImageManager->configSet() - There is no such parameter [' + configName + ']');
        return;
      }
      _config[configName] = setable[configName](configValue);
    };
    /**
     * Put image in download state
     * @param {Array|number|String} id
     * @return {Array|boolean|Object}
     * @public
     */
    function _startById(id) {
      if (_.isArray(id)) {
        return _.forEach(id, function (value) {
          return _startById(value);
        });
      }
      if (!_hasId(id)) {
        _cfgDebug && console.info('ImageManager->_startById() - ID is not exists');
        return false;
      }
      _listOfImages[id].isPaused = false;
      _checkOut();
      return true;
    }

    /**
     * Prevent image from being downloaded
     * @param {String} srcUrl
     * @return {Array|boolean}
     * @public
     */
    scope.pauseBySrc = function (srcUrl) {
      if (_.isArray(srcUrl)) {
        return _.forEach(srcUrl, function (value) {
          return scope.pauseBySrc(value);
        });
      }
      if (!scope.hasSource(srcUrl)) {
        _cfgDebug && console.info('ImageManager - > pauseBySrc() - SRC is not added: ' + srcUrl);
        return false;
      }
      var id = _srcList[srcUrl];
      _listOfImages[id].isPaused = true;
      return true;
    };
    /**
     * Put image in download state
     * @param {String} srcUrl
     * @return {Array|boolean}
     * @public
     */
    scope.startBySrc = function (srcUrl) {
      if (_.isArray(srcUrl)) {
        return _.forEach(srcUrl, function (value) {
          return scope.startBySrc(value);
        });
      }
      if (!scope.hasSource(srcUrl)) {
        _cfgDebug && console.info('ImageManager->startBySrc() - SRC is not added: ' + srcUrl);
        return false;
      }
      var id = _srcList[srcUrl];
      _listOfImages[id].isPaused = false;
      _checkOut();
      return true;
    };
    /**
     * Prevent all not started downloads
     * @public
     */
    scope.pauseAll = function () {
      scope.pauseBySrc(_.keys(_listOfImages));
    };
    /**
     * Start all not started downloads
     * @public
     */
    scope.startAll = function () {
      _startById(_.keys(_listOfImages));
    };
    /**
     * Add image to list, put it into cache
     * @param {HTMLImageElement|{element: HTMLImageElement}|String} image
     * @returns {Object}
     * @public
     * @example
     * scope.cacheAdd('http://to.some/image.img');
     * scope.cacheAdd($('#myImage').get(0))
     */
    scope.cacheAdd = function (image) {
      _cache.add(image);
    };
    /**
     * Get information about cached image
     * @param {String} src
     * @return {boolean|Object}
     * @public
     */
    scope.cacheGet = function (src) {
      return _cache.get(src, false);
    };
    /**
     * Remove image from cache
     * @param {String} src
     * @return {null|Object}
     * @public
     */
    scope.cacheRemove = function (src) {
      return _cache.remove(src);
    };
    /**
     * List of image url's in cache
     * @return {Array}
     * @public
     */
    scope.cacheList = function () {
      return _cache.keys();
    };
    /**
     * Clear cache from all images
     * @public
     */
    scope.cacheClear = function () {
      _cache.destroy();
    };
    Object.defineProperty(scope, 'cacheSize', {
      /**
       * Get limit of cached images
       * @return {number}
       * @public
       */
      get: function () {
        return _cache.limit;
      },
      /**
       * Set limit of cached images
       * @param {number} value
       * @public
       */
      set: function (value) {
        _cache.limit = value;
      }
    });
  }

  return ImageManager;
}));
