/*!
 * A MongoDB inspired ES6 Map() DSL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapDSL/master/LICENSE
 */
'use strict';
const MapDSL = new (require('../chainable/'))(),
      assert = require('assert');

// Set extra data outside of the set tests,
// keep terminal spam down.
try {
    MapDSL.set('test3', 'string');
    MapDSL.set('test4', {
        qux: 1234,
    });
    MapDSL.set('test5',{
        foo: 7,
        bar: null
    });
    MapDSL.set('test6',{
        foo: 3,
        bar: 100,
        baz: -10
    });
    MapDSL.set('test7', {
        array: ['A', 'B', 'C']
    });
 } catch (e) {
}
describe('Set', () => {
    describe('#set()', () => {
        it('it should set test0 to 10', () => {
            assert.equal(MapDSL.set('test0', 10), MapDSL);
        });
        it('it should set test1 to { foo: \'bar\' }', () => {
            assert.equal(MapDSL.set('test1', { foo: 'bar' }), MapDSL);
        });
        it('it should set test2 to { bar: 5, baz: 6 }', () => {
            assert.equal(MapDSL.set('test2', { bar: 5, baz: 6 }), MapDSL);
        });
    });
});
describe('Get', () => {
    describe('#has()', () => {
        it('it should return true for test0', () => {
            assert.equal(MapDSL.has('test0'), true);
        });
        it('it should return true for test6', () => {
            assert.equal(MapDSL.has('test6'), true);
        });
    });
    describe('#get()', () => {
        it('it should return 10 for value of test0', () => {
            assert.equal(MapDSL.get('test0'), 10);
        });
        it('it should return number for typeof of test0', () => {
            assert.equal(typeof MapDSL.get('test0'), 'number');
        });
        it('it should return bar for value of test1.foo', () => {
            assert.equal(MapDSL.get('test1').foo, 'bar');
        });
        it('it should return 5 for value of test2.bar', () => {
            assert.equal(MapDSL.get('test2').bar, 5);
        });
        it('it should return "string" for value of test3', () => {
            assert.equal(MapDSL.get('test3'), 'string');
        });
        it('it should return string for typeof of test3', () => {
            assert.equal(typeof MapDSL.get('test3'), 'string');
        });
    });
    describe('#find()', () => {
        it('it should find test0 with: { \'$eq\': 10 }', () => {
            assert.equal(MapDSL.find({ '$eq': 10 })[0]._id, 'test0');
        });
        it('it should find test1 with: { foo: { \'$eq\': \'bar\' } }', () => {
            assert.equal(MapDSL.find({ foo: { '$eq': 'bar' } })[0]._id, 'test1');
        });
        it('it should find test2 with: { bar: { \'$lt\': 10 }, baz: { \'$gt\': 3 } }', () => {
            assert.equal(MapDSL.find({ bar: { '$lt': 10 }, baz: { '$gt': 3 } })[0]._id, 'test2');
        });
        it('it should find test3 with: { \'$regex\': /^Str/i }', () => {
            assert.equal(MapDSL.find({ '$regex': /^Str/i })[0]._id, 'test3');
        });
        it('it should find test4 with: { bar: { \'$type\': \'number\' } }', () => {
            assert.equal(MapDSL.find({ qux: { '$type': 'number' } })[0]._id, 'test4');
        });
        it('it should find test5 with: { \'$or\': [{ foo: { \'$eq\': 14 } }, { bar: { \'$eq\': null } ] }', () => {
            assert.equal(MapDSL.find({ '$or': [{ foo: { '$eq': 14 } }, { bar: { '$eq': null } }] })[0]._id, 'test5');
        });
        it('it should find test6 with: { \'$and\': [{ foo: { \'$eq\': 3 } }, { \'$or\': [{ bar: { \'$eq\': null } }, { baz: { \'$eq\' : -10 } } ] } ] }', () => {
            assert.equal(MapDSL.find({ '$and': [{ foo: { '$eq': 3 } }, { '$or': [{ bar: { '$eq': null } }, { baz: { '$eq' : -10 } } ] } ] })[0]._id, 'test6');
        });
        it('it should find test7 with: { \'array\': [\'A\', \'B\', \'C\'] }', () => {
            assert.equal(MapDSL.find({ 'array': ['A', 'B', 'C'] })[0]._id, 'test7');
        });
    });
    describe('#chain()', () => {
        it('it should return "{ \'$eq\' : 10 }" for chain().eq(10).query', () => {
            assert.deepEqual(MapDSL.chain().eq(10).query, { '$eq' : 10 });
        });
        it('it should return "{ foo: { \'$eq\' : 10 } }" for chain().eq(\'foo\', 10).query', () => {
            assert.deepEqual(MapDSL.chain().eq('foo', 10).query, { foo: { '$eq' : 10 } });
        });
        it('it should return "{ foo: { \'$gt\' : 10 }, bar: { \'$lt\': 100 } }" for chain().gt(\'foo\', 10).lt(\'bar\', 100).query', () => {
            assert.deepEqual(MapDSL.chain().gt('foo', 10).lt('bar', 100).query, { foo: { "$gt" : 10 }, bar: { "$lt": 100 } });
        });
        it('it should find test0 for chain().eq(10).execute()', () => {
            assert.deepEqual(MapDSL.chain().eq(10).execute()[0]._id, 'test0');
        });
        it('it should find test1 for chain().eq(\'foo\',\'bar\').execute()', () => {
            assert.deepEqual(MapDSL.chain().eq('foo', 'bar').execute()[0]._id, 'test1');
        });
        it('it should find test2 for chain().and((chain) => { return [chain.eq(\'bar\', 5), chain.lt(\'baz\', 10)] }).execute()', () => {
            assert.deepEqual(MapDSL.chain().and((chain) => { return [chain.eq('bar', 5), chain.lt('baz', 10)] }).execute()[0]._id, 'test2');
        });
    });
});
describe('Delete', () => {
    describe('#delete()', () => {
        it('it should remove test0', () => {
            assert.equal(MapDSL.delete('test0'), true);
        });
    });
    describe('#clear()', () => {
        it('it should remove all entries', () => {
            MapDSL.clear()
            assert.equal([...MapDSL.entries()].length, 0);
        });
    });
});
