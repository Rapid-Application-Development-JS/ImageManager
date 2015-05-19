Image Manager
===========

Download image manager plus cache manager.

#### Require in Node

```javascript
var imageManager = require("image-manager");
```

### API

> cacheAdd (image: ImageElement|{element: ImageElement}|String): Object

```javascript
imageManager.cacheAdd('http://to.some/image.img');
// or
imageManager.cacheAdd($('#myImage').get(0));
// or
var image = new Image;
image.setAttribute(src, 'http://to.some/image.img');
imageManager.cacheAdd(image);
// or
var image = new Image;
image.setAttribute(src, 'http://to.some/image.img');
imageManager.cacheAdd({
	element: image,
	timestamp: 1430155235645
});
```

Add image to list, put it into cache.

> cacheClear ()

Clear cache from all images.

> cacheGet (src: String): boolean|Object

```javascript
imageManager.cacheGet("http://to.some/image.img");
//  →  Object {element: Image, timestamp: 1430155235645}
```

Get information about cached image.

> cacheList (): Array

```javascript
imageManager.cacheList();
// → ["http://to.some/image_1.img", "http://to.some/image_2.img", "http://to.some/image_3.img"]
```

List of image url's in cache.

> cacheRemove (src: String): null|Object

```javascript
imageManager.cacheRemove("http://to.some/image.img");
//  →  Object {element: Image, timestamp: 1430155235645}
```

Remove image from cache.

> configGet (): Object

```javascript
imageManager.configGet();
// →  {
// →      fullRepeal: false,
// →      isPaused: false,
// →      maxDownloads: 1,
// →      onError: null,
// →      onResolve: null,
// →      onSuccess: null,
// →  }
```

Gets the settings for downloading images.

> configReset ()

```javascript
imageManager.configReset();
```

Resets the configuration.

> configSet (configName: Object|String, configValue: *)

```javascript

imageManager.configSet("fullRepeal", true); // Allow cancel of image loading, applied for all new images
imageManager.configSet("maxDownloads", 99); // Maximum redowloads of image, applied for all new images
imageManager.configSet("onError", function (image) {
}); // callback for image downloading error, applied for all new images
imageManager.configSet("onResolve", function (image) {
}); // callback for image downloading finished, applied for all new images
imageManager.configSet("onSuccess", function (image) {
}); // callback for image downloading success, applied for all new images
```

Set configuration parameter.

> imageManager.hasSource (srcUrl: String): boolean

```javascript
imageManager.hasSource("http://to.some/image.img");
```

Is URL in the image list.

> loadImage (srcUrl: String, options: Object): boolean|Number

```javascript
imageManager.loadImage("http://to.some/image.img", {
	fullRepeal: boolean, // allow cancelling download request, good for big images and infinite scroll
	isPaused: boolean, // image downloadind must be started manually
	maxDownloads: number, // maximum redowloads of image, usually one is enough
	onError: Function|null, // callback on image download error
	onResolve: Function|null, // callback on image manipulations ended, called regardless of the result
	onSuccess: Function|null // allback on image download success
});

imageManager.loadImage("http://to.some/image.img", {
	onSuccess: function (image) {
		console.dir(image);
// →	{
// →		completed: true
// →		id: 25
// →		src: "http://to.some/image.img"
// →	}
	}
});
```

Adds an object to the image list.

> onFinish: null|Fucntion

```javascript
imageManager.onFinish = function () {
	console.log('Loading all images completed');
};
```

Callback called when everything is done.

> pauseAll ()

```javascript
imageManager.pauseAll();
```

Prevent all not started downloads.

> pauseBySrc (srcUrl: String): Array|boolean|Object

```javascript
imageManager.pauseBySrc("http://to.some/image.img");
imageManager.pauseBySrc(["http://to.some/image_1.img", "http://to.some/image_2.img"]);
```

Prevent image from being downloaded.

> startAll ()

```javascript
imageManager.startAll();
```

Start all not started downloads.

> startBySrc (srcUrl: String): Array|boolean

```javascript
imageManager.startBySrc("http://to.some/image.img");
// → true
// or
imageManager.startBySrc(["http://to.some/image_1.img", "http://to.some/image_2.img"]);
//  → [true, true]
```

Put image in download state.
