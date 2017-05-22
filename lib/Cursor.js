/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
class Cursor extends Array {
      constructor (...args) {
          super(...args);
      }

      /*
       * If `result` is a valid QueryResult object, add it to the cursor.
       */
      add (result = []) {
          Array.prototype.push.apply(this, (Array.isArray(result) ? result : [result]).filter((res) => {
              return res.isResult;
          }));
          return this;
      }

      /*
       * Sort by object keys, -1 for descending.
       */
      sort (obj = {}) {
          Object.keys(obj).forEach((key, idx) => {
              Array.prototype.sort.call(this.filter((obj) => { return obj.isResult }), (a, b) => {
                  if (!(a.value === Object(a.value) && b.value === Object(b.value))) {
                     return 0;
                  }
                  return ((a.value[key] < b.value[key]) ? -1 : ((a.value[key] > b.value[key]) ? 1 : 0));
               })[(obj[key] === -1 ? 'reverse' : 'valueOf')]().forEach((val, idx2) => {
                  this[idx2] = val;
              });
          });
          return this;
      }

      /*
       * Return a specified number of results, default to 1.
       */
      limit (num = 1) {
          return this.slice(0, num);
      }
}

/*
 * Export the `Cursor` class for use!
 */
module.exports = Cursor;
