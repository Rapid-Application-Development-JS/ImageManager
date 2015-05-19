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
