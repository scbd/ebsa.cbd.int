/*(The MIT License)

Copyright 2011-2012 HipSnip Limited

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Modified version of node-solr-client https://github.com/lbdremy/solr-node-client/blob/master/lib/utils/format.js
// format module. Changed to work in the browser with RequireJS

define([], function() {
  /**
   * ISOify `Date` objects (possibly in collections)
   *
   * @param {Array|Object} obj
   *
   * @return {Array|Object}
   * @api private
   */

  function dateISOify(obj) {
    if (obj instanceof Array) {
      for (var i = 0; i < obj.length; i++) {
        obj[i] = dateISOify(obj[i]);
      }
    } else if (obj instanceof Object && !(obj instanceof Date)) {
      for (var key in obj) {
        if (obj[key] instanceof Date) obj[key] = toISOString(obj[key]);
      }
    } else {
      if (obj instanceof Date) obj = toISOString(obj);
    }
    return obj;
  };

  /**
   * ISOify a single `Date` object
   * Sidesteps `Invalid Date` objects by returning `null` instead
   *
   * @param {Date}
   *
   * @return {null|String}
   * @api private
   */
  function toISOString(date) {
    return (date && !isNaN(date.getTime())) ? date.toISOString() : null;
  };


  /**
   * Serialize an object to a string. Optionally override the default separator ('&') and assignment ('=') characters.
   *
   * @param {Object} obj - object to serialiaze
   * @param {String} [sep] - separator character
   * @param {String} [eq] - assignment character
   * @param {String} [name] -
   *
   * @return {String}
   * @api private
   */

  function stringify(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    obj = (obj === null) ? undefined : obj;

    switch (typeof obj) {
      case 'object':
        return Object.keys(obj).map(function(k) {
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return stringifyPrimitive(k) +
                eq +
                stringifyPrimitive(v);
            }).join(sep);
          } else {
            return stringifyPrimitive(k) +
              eq +
              stringifyPrimitive(obj[k]);
          }
        }).join(sep);

      default:
        if (!name) return '';
        return stringifyPrimitive(name) + eq +
          stringifyPrimitive(obj);
    }
  };

  /**
   * Stringify a primitive
   *
   * @param {String|Boolean|Number} v - primitive value
   *
   * @return {String}
   * @api private
   */
  function stringifyPrimitive(v) {
    switch (typeof v) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  };

  return {
    dateISOify: dateISOify,
    stringify: stringify,
    toISOString: toISOString
  };
});