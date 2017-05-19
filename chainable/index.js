/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
const MapDSL = require('../lib/MapDSL'),
      ChainManager = require('../lib/ChainManager');

/*
 * Add the chain() function to MapDSL to allow for chained queries.
 *     {Instance}.chain().gt('foo', 5).lt('bar', 100).execute();
 */
MapDSL.prototype.chain = function () {
    return new ChainManager(this, require('../operators/Query'), require('../operators/Logical'));
}

module.exports = MapDSL;
