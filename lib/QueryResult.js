/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
class QueryResult {
      constructor (id = null, value = {}) {
          this._id = id;
          this.value = value;
      }

      /*
       * Convert an array of entries to an array of QueryResult objects.
       */
      static convert (entries) {
          return entries.map((entry) => {
               return new QueryResult(entry[0], entry[1]);
          });
      }

      /*
       * Validate a possible `QueryResult` object.
       */
      static isResult (obj = {}) {
          return (obj instanceof QueryResult && '_id' in obj && 'value' in obj);
      }
      get isResult () {
          return this.constructor.isResult(this);
      }
}

/*
 * Export the `QueryResult` class for use!
 */
module.exports = QueryResult;
