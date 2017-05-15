/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
module.exports = {
    '$regex': {
        fn: (val, regex = null) => {
           return (regex ? new RegExp(regex).test(val) : false);
        }
    }
};
