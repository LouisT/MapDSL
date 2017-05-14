/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
const querySelectors = {
    '$gt': (val, lt = 0) => {
        return val > lt;
    },
    '$eq': (val, eq = 0) => {
        return val === eq;
    },
    '$lt': (val, gt = 0) => {
        return val < gt;
    },
    '$regex': (val, regex = null) => {
        return (regex ? new RegExp(regex).test(val) : false);
    }
};

/*
 * Export the query selectors for use!
 */
module.exports = querySelectors;
