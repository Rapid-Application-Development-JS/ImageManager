require.config({
  "baseUrl": "vendors/",
  "paths": {
    "cachelru": "cachelru/release/cachelru.min",
    "image-manager": "image-manager/release/image-manager.min"
  },
  "waitSeconds": 0
});
require(["image-manager"], function (ImageManager) {
  var imageList = [
    'http://fc01.deviantart.net/fs50/f/2009/308/f/c/Sacred_Forest_1_4_Hi_Res_by__zagadka_.png',
    'http://fc00.deviantart.net/fs71/f/2015/046/5/5/extrasolar_comet___4k_high_res_remake_by_nirklars-d8i4foj.png',
    'http://fc08.deviantart.net/fs71/f/2012/009/6/7/67618400181402536a68ed4d982d9aff-d4lvaow.jpg',
    'http://fc02.deviantart.net/fs71/f/2012/111/d/0/winter_holiday_by_deoce-d4wmh06.png',
    'http://fc00.deviantart.net/fs71/f/2013/291/d/1/old_library_render_high_res_by_misterjl-d6qwnmi.png',
    'http://fc02.deviantart.net/fs70/i/2012/342/6/6/mordor__super_final_high_res_variant__by_entar0178-d5nfjcu.jpg'
  ];
  var imageManager = new ImageManager(false);
  console.info('%cCurrent image loading configuration', 'color: magenta;');
  console.dir(imageManager.configGet());
  imageManager.debug = true;
  imageManager.activeDerived = 1;
  imageManager.listSize = 9;
  imageManager.configSet('maxDownloads', 999);
  imageManager.onFinish = function () {
    console.info('%c[Loading of images completed]', 'color: blue;');
  };
  imageManager.configSet('onError', function OnError(image) {
    console.info('%c[OnError]', 'color: red;');
    console.dir(image);
  });
  imageManager.configSet('onSuccess', function OnSuccess(image) {
    console.info('%c[OnSuccess]', 'color: green;');
    console.dir(image);
    var img = new Image();
    img.src = image.src;
    document.body.appendChild(img);
  });
  imageManager.configSet('onResolve', function OnResolve(image) {
    console.info('%c[OnResolve]', 'color: blue;');
    console.dir(image);
  });
  imageManager.loadImage(imageList[0], {isPaused: true});
  imageManager.loadImage(imageList[1], {isPaused: true});
  imageManager.loadImage(imageList[2], {isPaused: true});
  imageManager.loadImage(imageList[3], {isPaused: true});
  imageManager.loadImage(imageList[4], {isPaused: true});
  imageManager.loadImage(imageList[5], {
    isPaused: true,
    onSuccess: function (image) {
      console.info('%c[OnSuccess-CustomFunction]', 'color: magenta;');
      console.dir(image);
      var img = new Image();
      img.src = image.src;
      img.style.border = '3px double lime';
      document.body.appendChild(img);
    }
  });
  console.info('%cList of SRC:', 'color: magenta;');
  console.dir(imageManager.srcList);
  imageManager.startAll();
});
