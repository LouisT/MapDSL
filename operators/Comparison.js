/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
const isEqual = require('is-equal');

module.exports = {
    '$eq': {
        fn: (val = true, eq = false) => {
            return isEqual(val, eq);
        }
    },
    '$gt': {
        fn: (val, lt) => {
            return val > lt;
        }
    },
    '$gte': {
        fn: (val, lte) => {
            return val >= lte;
        }
    },
    '$lt': {
        fn: (val, gt) => {
            return val < gt;
        }
    },
    '$lte': {
        fn: (val, gte) => {
            return val <= gte;
        }
    },
    '$ne': {
        fn: (val, ne) => {
            return val !== ne;
        }
    }
};
