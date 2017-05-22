/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
const queryOperators = require('../operators/Query'),
      logicalOperators = require('../operators/Logical'),
      QueryResult = require('./QueryResult'),
      Cursor = require('./Cursor'),
      Helpers = require('./Helpers');

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
       * Validate a possible QueryResult.
       */
      isResult (obj) {
          return QueryResult.isResult(obj);
      }

      /*
       *  Get the valid query and logical operators.
       */
      static get queryOperators () {
          return queryOperators;
      }
      static get logicalOperators () {
          return logicalOperators;
      }

      /*
       * Check if a string is a query operator.
       */
      isQueryOperator (qs = null) {
          return this.constructor.queryOperators.hasOwnProperty(qs) == true;
      }

      /*
       * Get the query selector to test against.
       */
      getQueryOperator (qs = '$_default') {
          return (this.constructor.queryOperators[qs] ? this.constructor.queryOperators[qs] : this.constructor.queryOperators['$_default']);
      }

      /*
       * Check if a string is a logic operator.
       */
      isLogicalOperator (lo = null) {
          return this.constructor.logicalOperators.hasOwnProperty(lo) == true;
      }

      /*
       * Get the logic operator by name.
       */
      getLogicalOperator (lo) {
          return (this.constructor.logicalOperators[lo] ? this.constructor.logicalOperators[lo] : { fn: [].every });
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
                 let value = undefined;
                 try {
                    value = Helpers.dotNotation(_query[0], entry[1]);
                 } catch (error) { }
                 return this.getQueryOperator(_query[1]).fn.apply(this, [
                     value,      // Entry value
                     _query[2],  // Test value
                     _query[0],  // Test key
                     entry       // Entry [<Key>, <Value>]
                 ]);
              }
          });
      }

      /*
       * Check all entries against every provided query selector.
       */
      find (queries = {}, projections = {}, one = false) {
          if (queries.constructor !== Object) {
             if (this.has(queries)) {
                return new Cursor().add(new QueryResult(queries, this.get(queries)));
             }
             queries = { '$eq' : queries };
          }
          let _queries = this.compileQueries(queries);
          if (!!_queries.list.length) {
             let cursor = new Cursor();
             for (let entry of this.entries()) {
                 if (this._validate(entry, _queries)) {
                    cursor.add(new QueryResult(entry[0], entry[1]));
                    if (one) {
                       return cursor;
                    }
                 }
             }
             return cursor;
           } else {
             return new Cursor().add(QueryResult.convert([...this.entries()]));
          }
      }

      /*
       * Check all entries against every provided query selector; return one.
       */
      findOne (queries = {}, projections = {}) {
          return this.find(queries, projections, true);
      }

      /*
       * Check all entries against every provided query selector; Promise based.
       */
      findAsync (queries = {}, projections = {}, one = false) {
          return new Promise((resolve, reject) => {
              try {
                  let results = this.find(queries, projections, one);
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
