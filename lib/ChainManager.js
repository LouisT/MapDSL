/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
class ChainManager {
      constructor (MapDSL, queryOperators = {}, logicalOperators = {}) {
          // Save a link to MapDSL for `execute()`.
          this.MapDSL = MapDSL;

          // Place holder for chained queries.
          this._chains = {};

          // Place holder for chainable functions.
          this._chainables = {};

          // Generate the chainable functions.
          //   {Instance}.gt(<Key / Value>[, <Value>]).lt(<Key / Value>[, <Value>]).execute([<Projections>)
          Object.keys(queryOperators).forEach((qo) => {
              let qoName = qo.replace(/^\$/,'');
              this[qoName] = (key, val = null, getChain = false) => {
                  return (!getChain ? this._addChain : this._getOperatorChain).call(this, key, val, `${qo}`);
              };
              this._chainables[qoName] = (key, val) => {
                  return this[qoName].call(this, key, val, true);
              };
          });
          Object.keys(logicalOperators).forEach((lo) => {
              let loName = lo.replace(/^\$/,'');
              this[loName] = (fn = () => { return [] }, getChain = false) => {
                  return (!getChain ? this._addChain : this._getLogicalChain).call(this, null, fn, `${lo}`, true);
              };
              this._chainables[loName] = (fn = () => { return [] }) => {
                  return this[loName].call(this, fn, `${lo}`, true);
              };
          });
      }

      /*
       *  Return the chains for query object if not empty otherwise false.
       */
      get query () {
          return (!!Object.keys(this._chains).length ? this._chains : false);
      }

      /*
       * Execute the chained commands.
       */
      execute (projections = {}) {
          return this.MapDSL.find(this.query, projections);
      }

      /*
       * Generate a chainable object.
       */
      _getOperatorChain (key, val, $op = '$eq') {
          return { [(val ? key : $op)]: (val ? { [$op]: val } : key) };
      }
      _getLogicalChain (undf, fn = () => { return [] }, $lo = '$and') {
          return { [$lo] : fn.call(this, this._chainables) };
      }

      /*
       * Builed the chain operator and logical object with all the queries.
       */
      _addChain (key, val, $type = '$eq', logical = false) {
          Object.assign(this._chains, (!logical ? this._getOperatorChain : this._getLogicalChain).call(this, key, val, $type));
          return this;
      }
}

/*
 * Export the chain manager for use!
 */
module.exports = ChainManager;