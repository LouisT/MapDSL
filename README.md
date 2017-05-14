MapDSL (WIP)
===
A __[MongoDB]__ inspired __[Map()]__ DSL.

This is a ___WIP___; do __NOT__ use in production yet! See [TODO](TODO.md) for more information.

### Example:
```javascript
let MapDSL = new (require('./MapDSL'))(),
    print = (obj) => { console.log('\n%s', JSON.stringify(obj, true, 4)); };

// Start out with some base data.
MapDSL.set('test0', 10);
MapDSL.set('test1', 'this is a string');
MapDSL.set('test2',{
    foo: 7,
    bar: 3
});
MapDSL.set('test11',{
    string: 'Look at me example all the things!'
});
// Fill with junk.
for (let num = 3; num < 10; num++) {
    MapDSL.set(`test${num}`, {
       foo: Math.floor(Math.random()*15)+1,
       bar: Math.floor(Math.random()*15)+1
    });
}

// Sync!
print(MapDSL.querySync({ foo: { '$gt': 6 }, bar: { '$lt': 10 } }));
print(MapDSL.querySync({ '$gt': 3 }));
print(MapDSL.querySync({ '$eq': 'this is a string' }));
print(MapDSL.querySync({ string: { '$regex': /Things!$/i } }));
print(MapDSL.querySync({ '$regex': /String$/i }));
print(MapDSL.querySync({ '$regex': /String$/ }));

// Promise!
MapDSL.query({ foo: { '$gt': 10 }, bar: { '$lt': 10 } }).then((results) => {
    print(results);
 }).catch((error) => {
    console.log(error);
});
```

[MongoDB]: https://docs.mongodb.com/manual/reference/operator/query/#query-selectors
[Map()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
