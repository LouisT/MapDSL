/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
const querySelectors = require('../queries/');

class MapDSL extends Map {
      constructor (_map) {
          super(_map);
      }

      /*
       * Flatten the query object to an array of arrays.
       *   [ [<Search Key>, <Query Selector>, <Test Value>], ... ]
       */
      _flattenQueries (obj = {}) {
          let results = [];
          for (let key of Object.keys(obj)) {
              if (obj[key].constructor === Object) {
                 let val = obj[key];
                 for (let mode of Object.keys(val)) {
                     results.push([key, mode, obj[key][mode]]);
                 }
               } else {
                 results.push([null, key, obj[key]]);
              }

          }
          return results;
      }

      /*
       * Get the query selector to test against.
       */
      _getQuerySelector (qs) {
          return (querySelectors[qs] ? querySelectors[qs] : () => { return false });
      }

      /*
       * Test the query selectors against an entry. If no entry key (query[0]) is provided treat the
       * entry as if it is not an object.
       */
      _test (entry = [], queries = []) {
          return queries.every((query) => {
              let value = (query[0] ? entry[1][query[0]] : entry[1]);

              return value && this._getQuerySelector(query[1]).call(this, value, query[2]);
          });
      }


      /*
       * Check all entries against every provided query selector; sync.
       */
      querySync (queries = {}) {
          let _queries = this._flattenQueries(queries),
              results = [];

          for (let entry of this.entries()) {
              if (this._test(entry, _queries)) {
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
      query (queries = {}) {
          return new Promise((resolve, reject) => {
              let results = this.querySync(queries);

              return (!!results.length ? resolve(results) : reject(new Error('No entries found.')));
          });
      }

}

/*
 * Export the module for use!
 */
module.exports = MapDSL;
