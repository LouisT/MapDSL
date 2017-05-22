/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
module.exports = {
    dotNotation: (keys, obj, $fn = ['return _']) => {
        return new Function('_', (keys ? $fn.concat([keys]) : $fn).join('.'))(obj);
    }
};
