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
