/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
module.exports = {
    '$exists': {
        fn: (val, bool, key, entry) => {
            return entry[1].hasOwnProperty(key) == Boolean(bool);
        }
    },
    '$type': {
        fn: (val, _type) => {
            try {
                return Object.prototype.toString.call(val).toLowerCase() === `[object ${_type.toLowerCase()}]`
             } catch (e) {
                throw new Error('$type must be a string.');
            }
        }
    }
};
