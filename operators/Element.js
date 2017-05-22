/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
const Helpers = require('../lib/Helpers');

module.exports = {
    '$exists': {
        chain: (key, val) => {
            let isbool = (key === true || key === false),
                check = (val !== null ? val : (isbool ? key : true));
            return (!isbool || val !== null ? { [key] : { '$exists': check } } : { '$exists': check });
        },
        fn: (val, bool, keys, entry) => {
            try {
               return (bool === (Helpers.dotNotation(keys, entry[1]) !== undefined));
             } catch (error) {
               return (keys === null ? (bool === undefined ? true : bool) : false);
            }
        }
    },
    '$type': {
        fn: (val, type) => {
            try {
               return Object.prototype.toString.call(val).toLowerCase() === `[object ${type.toLowerCase()}]`;
             } catch (error) {
               return false;
            }
        }
    }
};
