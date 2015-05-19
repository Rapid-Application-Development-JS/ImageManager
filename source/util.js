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
