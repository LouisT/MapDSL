/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
const queryOperators = require('../operators/Query'),
      logicalOperators = require('../operators/Logical');

class MapDSL extends Map {
      constructor (_map) {
          super(_map);
      }

      /*
       * Convert the query object to an Object with an Array of queries.
       */
      compileQueries (obj = {}) {
          let results = {
              operator: false,
              list: []
          };
          for (let key of Object.keys(obj)) {
              let isOP = this.isOperator(key);
              if (obj[key].constructor === Object) {
                 let val = obj[key];
                 for (let mode of Object.keys(val)) {
                     results.list.push([key, mode, obj[key][mode]]);
                 }
               // If the query is an array, treat it as a logical operator.
               } else if (isOP && Array.isArray(obj[key])) {
                 for (let subobj of obj[key]) {
                     // Recursively compile sub-queries for logical operators.
                     results.list.push(this.compileQueries(subobj));
                 }
                 // Store the logical operator for this query; used in _validate().
                 results.operator = key;
               } else {
                 results.list.push([(isOP ? null : key), (isOP ? key: '$eq'), obj[key]]);
              }
          }
          return results;
      }

      /*
       * Check if a string is a query operator.
       */
      isQueryOperator (qs = null) {
          return queryOperators.hasOwnProperty(qs) == true;
      }

      /*
       * Get the query selector to test against.
       */
      getQueryOperator (qs = '$_default') {
          return (queryOperators[qs] ? queryOperators[qs] : queryOperators['$_default']);
      }

      /*
       * Check if a string is a logic operator.
       */
      isLogicalOperator (lo = null) {
          return logicalOperators.hasOwnProperty(lo) == true;
      }

      /*
       * Get the logic operator by name.
       */
      getLogicalOperator (lo) {
          return (logicalOperators[lo] ? logicalOperators[lo] : { fn: [].every });
      }

      /*
       * Check if a string is a query operator OR a logical operator.
       */
      isOperator (op) {
         return this.isQueryOperator(op) || this.isLogicalOperator(op);
      }

      /*
       * Recursively test the query operator(s) against an entry, checking against any
       * logic operators provided.
       */
      _validate (entry = [], queries = {}) {
          return this.getLogicalOperator(queries.operator).fn.call(queries.list, (_query) => {
              if (this.isLogicalOperator(queries.operator)) {
                 return this._validate(entry, _query);
               } else {
                 return this.getQueryOperator(_query[1]).fn.apply(this, [
                     (_query[0] ? entry[1][_query[0]] : entry[1]), // Entry value
                     _query[2],                                    // Test value
                     _query[0],                                    // Test key
                     entry                                         // Entry [<Key>, <Value>]
                 ]);
              }
          });
      }

      /*
       * Check all entries against every provided query selector; sync.
       */
      find (queries = {}, projections = {}) {
          let _queries = this.compileQueries(queries),
              results = [];
          for (let entry of this.entries()) {
              if (this._validate(entry, _queries)) {
                 results.push(Object.assign({
                    _id: entry[0]
                 }, { value: entry[1] }));
              }
          }
          return results;
      }

      /*
       * Check all entries against every provided query selector; Promise based.
       */
      findAsync (queries = {}) {
          return new Promise((resolve, reject) => {
              try {
                  let results = this.find(queries);
                  return (!!results.length ? resolve(results) : reject(new Error('No entries found.')));
               } catch (error) {
                  reject(error);
              }
          });
      }
}

/*
 * Export the module for use!
 */
module.exports = MapDSL;
