/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
const Helpers = require('../lib/Helpers');

module.exports = {
    '$regex': {
        fn: (val, regex = /./i) => {
            return Helpers.is(regex, 'regexp') ? new RegExp(regex).test(val) : false;
        }
    }
};
